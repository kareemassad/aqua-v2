import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import connectMongo from "@/lib/mongoose";
import Store from "@/models/Store";
import Product from "@/models/Product";
import ExcelJS from 'exceljs';
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const formData = await request.formData();
    const excelUrl = formData.get('fileUrl'); // URL from UploadThing
    const storeId = formData.get('storeId');
    const userId = formData.get('userId');
    if (!excelUrl) {
      return NextResponse.json({ error: "No file URL provided" }, { status: 400 });
    }

    if (!storeId || !validator.isMongoId(storeId)) {
      return NextResponse.json({ error: "Valid Store ID is required" }, { status: 400 });
    }

    // Fetch the Excel file from the URL
    const response = await fetch(excelUrl);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch Excel file" }, { status: 400 });
    }

    const buffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Buffer.from(buffer));
    const worksheet = workbook.worksheets[0];
    const data = [];

    // Convert worksheet to JSON
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      const rowData = {};
      row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        if (rowNumber === 1) {
          rowData.header = cell.text;
        } else {
          const header = worksheet.getRow(1).getCell(colNumber).text;
          rowData[header] = cell.text;
        }
      });
      if (rowNumber > 1) { // Skip header row
        data.push(rowData);
      }
    });

    // Validate store ownership
    const store = await Store.findOne({ _id: storeId, user_id: userId });
    if (!store) {
      return NextResponse.json({ error: "Store not found or unauthorized" }, { status: 404 });
    }

    // Process each row and create products
    const results = { created: 0, duplicates: 0, invalid: 0 };
    const errors = [];

    for (const [index, row] of data.entries()) {
      const { name, sell_price, inventory, description, id_number, image } = row;

      // Validate required fields
      if (!name || sell_price == null || inventory == null) {
        results.invalid += 1;
        errors.push({ row: index + 2, error: "Missing required fields: name, sell_price, inventory" });
        continue;
      }

      // Validate data types
      if (
        typeof name !== 'string' ||
        isNaN(parseFloat(sell_price)) ||
        isNaN(parseInt(inventory, 10))
      ) {
        results.invalid += 1;
        errors.push({ row: index + 2, error: "Invalid data types for name, sell_price, or inventory" });
        continue;
      }

      // Optional fields validation
      const sanitizedDescription = description ? validator.escape(description.toString()) : "";
      const sanitizedIdNumber = id_number ? validator.escape(id_number.toString()) : "";
      const sanitizedImage = image ? validator.escape(image.toString()) : "";

      // Check for duplicate products based on unique identifier (id_number)
      let duplicate = false;
      if (sanitizedIdNumber) {
        const existingProduct = await Product.findOne({ store_id: storeId, id_number: sanitizedIdNumber });
        if (existingProduct) {
          duplicate = true;
          results.duplicates += 1;
          errors.push({ row: index + 2, error: "Duplicate product based on id_number" });
        }
      }

      if (duplicate) continue;

      // Create new product with backend-assigned ID
      await Product.create({
        store_id: storeId,
        name: validator.escape(name),
        sell_price: parseFloat(sell_price),
        inventory: parseInt(inventory, 10),
        description: sanitizedDescription,
        id_number: sanitizedIdNumber,
        image: sanitizedImage,
        product_id: uuidv4(), // Backend-assigned ID
      });

      results.created += 1;
    }

    return NextResponse.json({ message: "Products imported successfully", results, errors }, { status: 200 });
  } catch (error) {
    console.error("Error processing Excel file:", error);
    return NextResponse.json({ error: "Error processing Excel file" }, { status: 500 });
  }
}