import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  const { productId } = params;
  await connectMongo();

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { productId } = params;
  const updatedProduct = await request.json();

  try {
    await connectMongo();
    const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Add DELETE method if needed
