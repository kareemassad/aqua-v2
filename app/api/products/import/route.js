import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";
import Store from "@/models/Store";
import { authOptions } from "@/lib/next-auth";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { mappings, data } = await request.json();

    if (!mappings || !data || !Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    await connectMongo();

    const store = await Store.findOne({ user_id: session.user.id });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const productsToCreate = [];

    // Assume the first row is headers
    const headers = data.parsedData[0];
    const rows = data.parsedData.slice(1);

    rows.forEach((row, rowIndex) => {
      const productData = {};
      for (let [excelField, productField] of Object.entries(mappings)) {
        if (productField) {
          let value = row[headers.indexOf(excelField)];
          if (typeof value === 'string') {
            value = value.trim();
          }
          productData[productField] = value || '';
        }
      }

      // Validate required fields
      if (!productData.name || !productData.sell_price) {
        // Skip invalid records or handle as needed
        console.warn(`Row ${rowIndex + 2} is missing required fields.`);
        return;
      }

      // Convert data types
      productData.sell_price = parseFloat(productData.sell_price);
      productData.inventory = parseInt(productData.inventory) || 0;
      productData.store_id = store._id;

      productsToCreate.push(productData);
    });

    if (productsToCreate.length === 0) {
      return NextResponse.json({ error: "No valid products to import" }, { status: 400 });
    }

    await Product.insertMany(productsToCreate);

    return NextResponse.json({ message: "Products imported successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error importing products:", error);
    return NextResponse.json({ error: "Failed to import products" }, { status: 500 });
  }
}