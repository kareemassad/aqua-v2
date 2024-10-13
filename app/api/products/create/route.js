import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";
import Store from "@/models/Store";
import { authOptions } from "@/lib/next-auth";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  // Log the session data
  console.log("Session Data:", session);

  if (!session) {
    console.error("Unauthorized: No valid session");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const payload = await request.json();
    console.log("Received payload for product creation:", payload);

    const {
      name,
      cost_price,
      sell_price,
      inventory,
      description,
      store_id,
      image,
      id_number,
    } = payload;

    // Validate required fields
    if (
      !name ||
      cost_price == null ||
      sell_price == null ||
      inventory == null ||
      !store_id
    ) {
      console.warn("Missing required fields");
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, cost_price, sell_price, inventory, store_id",
        },
        { status: 400 },
      );
    }

    // Parse numerical values
    const parsedCostPrice = parseFloat(cost_price);
    const parsedSellPrice = parseFloat(sell_price);
    const parsedInventory = parseInt(inventory, 10);

    // Validate data types
    if (
      typeof name !== "string" ||
      isNaN(parsedCostPrice) ||
      isNaN(parsedSellPrice) ||
      isNaN(parsedInventory)
    ) {
      console.warn("Invalid data types for fields");
      return NextResponse.json(
        {
          error:
            "Invalid data types for fields: name must be string, cost_price, sell_price, inventory must be valid numbers",
        },
        { status: 400 },
      );
    }

    // Additional Validation: Ensure numerical fields are valid numbers
    if (
      !Number.isFinite(parsedCostPrice) ||
      !Number.isFinite(parsedSellPrice) ||
      !Number.isInteger(parsedInventory)
    ) {
      console.warn("Invalid numerical values");
      return NextResponse.json(
        {
          error:
            "Invalid numerical values for cost_price, sell_price, or inventory",
        },
        { status: 400 },
      );
    }

    // Optional fields validation
    const sanitizedDescription = description
      ? validator.escape(description.toString())
      : "";
    const sanitizedIdNumber = id_number
      ? validator.escape(id_number.toString())
      : uuidv4(); // Generate if not provided
    const sanitizedImage = image ? validator.escape(image.toString()) : "";

    // Check for duplicate products based on unique identifier (id_number)
    if (sanitizedIdNumber) {
      const existingProduct = await Product.findOne({
        store_id: store_id,
        id_number: sanitizedIdNumber,
      });
      if (existingProduct) {
        console.warn("Duplicate product based on id_number");
        return NextResponse.json(
          { error: "Duplicate product based on id_number" },
          { status: 409 },
        );
      }
    }

    // Ensure store exists and belongs to the user
    console.log("Searching for store with user_id:", session.user.id);
    const store = await Store.findOne({ user_id: session.user.id });
    console.log("Store lookup result:", store);

    if (!store) {
      console.warn("Store not found or unauthorized");
      return NextResponse.json(
        { error: "Store not found or unauthorized" },
        { status: 404 },
      );
    }

    // Create new product with backend-assigned ID and id_number
    const newProduct = await Product.create({
      store_id: store_id,
      name: validator.escape(name),
      sell_price: parsedSellPrice,
      cost_price: parsedCostPrice,
      inventory: parsedInventory,
      description: sanitizedDescription,
      id_number: sanitizedIdNumber,
      image: sanitizedImage,
      product_id: uuidv4(), // Backend-assigned ID
    });

    console.log("Product created successfully:", newProduct);
    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 },
    );
  }
}
