import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/libs/dbConnect";
import Store from "@/models/Store";
import Product from "@/models/Product";
import xlsx from 'xlsx';
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const storeId = formData.get('storeId');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!storeId || !validator.isMongoId(storeId)) {
      return NextResponse.json({ error: "Valid Store ID is required" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only Excel files are allowed." }, { status: 400 });
    }

    // Limit file size to 5MB
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Validate store ownership
    const store = await Store.findOne({ _id: storeId, user_id: session.user.id });
    if (!store) {
      return NextResponse.json({ error: "Store not found or unauthorized" }, { status: 404 });
    }

    // Process each row and create products
    const results = { created: 0, duplicates: 0, invalid: 0 };
    const errors = [];

    for (const [index, row] of data.entries()) {
      const { name, sell_price, inventory, description, serial_number, id_number, image } = row;

      // Validate required fields
      if (!name || sell_price == null || inventory == null) {
        results.invalid += 1;
        errors.push({ row: index + 1, error: "Missing required fields: name, sell_price, inventory" });
        continue;
      }

      // Validate data types
      if (
        typeof name !== 'string' ||
        typeof sell_price !== 'number' ||
        typeof inventory !== 'number'
      ) {
        results.invalid += 1;
        errors.push({ row: index + 1, error: "Invalid data types for name, sell_price, or inventory" });
        continue;
      }

      // Optional fields validation
      const sanitizedDescription = description ? validator.escape(description.toString()) : "";
      const sanitizedSerialNumber = serial_number ? validator.escape(serial_number.toString()) : "";
      const sanitizedIdNumber = id_number ? validator.escape(id_number.toString()) : "";
      const sanitizedImage = image ? validator.escape(image.toString()) : "";

      // Check for duplicate products based on unique identifiers
      let duplicate = false;
      if (sanitizedSerialNumber) {
        const existingProduct = await Product.findOne({ store_id: storeId, serial_number: sanitizedSerialNumber });
        if (existingProduct) {
          duplicate = true;
          results.duplicates += 1;
          errors.push({ row: index + 1, error: "Duplicate product based on serial_number" });
        }
      }

      if (sanitizedIdNumber && !duplicate) {
        const existingProduct = await Product.findOne({ store_id: storeId, id_number: sanitizedIdNumber });
        if (existingProduct) {
          duplicate = true;
          results.duplicates += 1;
          errors.push({ row: index + 1, error: "Duplicate product based on id_number" });
        }
      }

      if (duplicate) continue;

      // Create new product
      await Product.create({
        store_id: storeId,
        name: validator.escape(name),
        sell_price: parseFloat(sell_price),
        inventory: parseInt(inventory, 10),
        description: sanitizedDescription,
        serial_number: sanitizedSerialNumber,
        id_number: sanitizedIdNumber,
        image: sanitizedImage,
        product_id: uuidv4(),
      });

      results.created += 1;
    }

    return NextResponse.json({ message: "Products imported successfully", results, errors }, { status: 200 });
  } catch (error) {
    console.error("Error processing Excel file:", error);
    return NextResponse.json({ error: "Error processing Excel file" }, { status: 500 });
  }
}