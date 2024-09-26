import { NextResponse } from "next/server";
import Product from "@/models/Product";
import dbConnect from "@/libs/dbConnect";

export async function POST(request) {
  await dbConnect();
  const data = await request.json();
  const product = await Product.create(data);
  return NextResponse.json(product);
}