import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import connectMongo from "@/lib/mongoose";
import Store from "@/models/Store";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongo();
    const store = await Store.findOne({ user_id: session.user.id });

    if (store) {
      return NextResponse.json(
        { storeId: store._id.toString() },
        { status: 200 },
      );
    } else {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 },
    );
  }
}
