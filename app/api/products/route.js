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

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    await connectMongo();

    const store = await Store.findOne({ user_id: session.user.id });
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments({ store_id: store._id });
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find({ store_id: store._id })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({ products, totalPages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
