import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Store from "@/models/Store";
import Product from "@/models/Product";
import { authOptions } from "@/libs/next-auth";
import { createStoreForUser } from "@/libs/userUtils";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("No session found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Connecting to MongoDB");
    await connectMongo();

    console.log("Finding user with ID:", session.user.id);
    const user = await User.findById(session.user.id).lean();
    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Finding store for user ID:", session.user.id);
    let store = await Store.findOne({ user_id: session.user.id }).lean();
    if (!store) {
      console.log("Store not found, creating a new one");
      store = await createStoreForUser(session.user.id, user.name);
    }

    console.log("Finding products for store ID:", store._id);
    const products = await Product.find({ store_id: store._id }).lean();

    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
      },
      store: {
        name: store.name,
        productCount: products.length,
      },
      // Add more dashboard data as needed
    };

    console.log("Returning dashboard data:", dashboardData);
    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}