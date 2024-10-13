import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import Store from "@/models/Store";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = params;
  const session = await getServerSession(authOptions);

  console.log(`Received dashboard request for userId: ${userId}`);
  console.log(`Session userId: ${session?.user.id}`);

  if (!session || session.user.id !== userId) {
    console.warn("Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongo();

    const user = await User.findById(userId).lean();
    if (!user) {
      console.warn(`User not found: ${userId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const store = await Store.findOne({ user_id: userId }).lean();
    if (!store) {
      console.warn(`Store not found for userId: ${userId}`);
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const products = await Product.find({ store_id: store._id }).lean();

    console.log(
      `Fetched ${products.length} products for storeId: ${store._id}`,
    );
    return NextResponse.json({ user, store, products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
