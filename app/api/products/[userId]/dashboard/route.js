// app/api/user/[userId]/dashboard/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Store from "@/models/Store";
import Product from "@/models/Product";
import { authOptions } from "@/libs/next-auth";
import { createStoreForUser } from "@/libs/userUtils";

export async function GET(request, { params }) {
  const { userId } = params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongo();

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let store = await Store.findOne({ user_id: userId }).lean();
    if (!store) {
      store = await createStoreForUser(userId, user.name);
    }

    console.log("Store created:", store);
    const products = await Product.find({ store_id: store._id }).lean();

    return NextResponse.json({ user, store, products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}