import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/libs/mongoose";
import Product from "@/models/Product";
import Store from "@/models/Store";
import { authOptions } from "@/libs/next-auth";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const payload = await request.json();
    const { name, id_number, cost_price, sell_price, inventory, description, store_id, image } = payload;

    // Validate required fields
    if (!name || cost_price == null || sell_price == null || inventory == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate data types
    if (
      typeof name !== 'string' ||
      typeof cost_price !== 'number' ||
      typeof sell_price !== 'number' ||
      typeof inventory !== 'number'
    ) {
      return NextResponse.json({ error: "Invalid data types for fields" }, { status: 400 });
    }

    // Optional fields validation
    const sanitizedDescription = description ? validator.escape(description.toString()) : "";
    const sanitizedIdNumber = id_number ? validator.escape(id_number.toString()) : "";
    const sanitizedImage = image ? validator.escape(image.toString()) : "";

    // Check for duplicate products based on unique identifier (id_number)
    if (sanitizedIdNumber) {
      const existingProduct = await Product.findOne({ store_id: store_id, id_number: sanitizedIdNumber });
      if (existingProduct) {
        return NextResponse.json({ error: "Duplicate product based on id_number" }, { status: 409 });
      }
    }

    // Create new product with backend-assigned ID
    const newProduct = await Product.create({
      store_id: store_id,
      name: validator.escape(name),
      sell_price: parseFloat(sell_price),
      cost_price: parseFloat(cost_price),
      inventory: parseInt(inventory, 10),
      description: sanitizedDescription,
      id_number: sanitizedIdNumber,
      image: sanitizedImage,
      product_id: uuidv4(), // Backend-assigned ID
    });

    return NextResponse.json({ message: "Product created successfully", product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Error creating product" }, { status: 500 });
  }
}