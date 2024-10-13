import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectMongo from "@/lib/mongoose";

export async function POST(request) {
  await connectMongo();
  const data = await request.json();
  const product = await Product.create(data);
  return NextResponse.json(product);
}
