import { NextResponse } from "next/server";
import dbConnect from "@/libs/dbConnect";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  await dbConnect();
  const { userId } = params;

  try {
    const products = await Product.find({ user_id: userId });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}