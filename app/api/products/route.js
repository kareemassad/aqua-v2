import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/libs/mongoose";
import Product from "@/models/Product";
import Store from "@/models/Store";
import { authOptions } from "@/libs/next-auth";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const store = await Store.findOne({ user_id: session.user.id });
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const products = await Product.find({ store_id: store._id }).lean();

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
  }
}
