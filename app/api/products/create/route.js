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

  const { store_id, name, sell_price, inventory, description, serial_number, id_number, image } = await request.json();

  // Validate inputs
  if (!store_id || !validator.isMongoId(store_id)) {
    return NextResponse.json({ error: "Valid Store ID is required" }, { status: 400 });
  }

  if (!name || !validator.isLength(name, { min: 1, max: 100 })) {
    return NextResponse.json({ error: "Valid product name is required" }, { status: 400 });
  }

  if (!sell_price || !validator.isFloat(sell_price.toString(), { min: 0 })) {
    return NextResponse.json({ error: "Valid sell price is required" }, { status: 400 });
  }

  if (inventory == null || !validator.isInt(inventory.toString(), { min: 0 })) {
    return NextResponse.json({ error: "Valid inventory count is required" }, { status: 400 });
  }

  try {
    await connectMongo();

    // Verify that the store belongs to the user
    const store = await Store.findOne({ _id: store_id, user_id: session.user.id });
    if (!store) {
      return NextResponse.json({ error: "Store not found or unauthorized" }, { status: 404 });
    }

    // Check for duplicate products based on unique identifiers
    if (serial_number) {
      const existingProduct = await Product.findOne({ store_id, serial_number: validator.escape(serial_number.toString()) });
      if (existingProduct) {
        return NextResponse.json({ error: "Product with this serial number already exists" }, { status: 400 });
      }
    }

    if (id_number) {
      const existingProduct = await Product.findOne({ store_id, id_number: validator.escape(id_number.toString()) });
      if (existingProduct) {
        return NextResponse.json({ error: "Product with this ID number already exists" }, { status: 400 });
      }
    }

    // Create new product
    const newProduct = await Product.create({
      store_id,
      name: validator.escape(name),
      sell_price: parseFloat(sell_price),
      inventory: parseInt(inventory, 10),
      description: description ? validator.escape(description.toString()) : "",
      serial_number: serial_number ? validator.escape(serial_number.toString()) : "",
      id_number: id_number ? validator.escape(id_number.toString()) : "",
      image: image ? validator.escape(image.toString()) : "",
      product_id: uuidv4(),
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}