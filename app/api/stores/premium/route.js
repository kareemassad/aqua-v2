import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Store from "@/models/Store";

export async function GET() {
  try {
    await connectMongo();
    const publicStores = await Store.find({ public: true }).lean();
    return NextResponse.json({ stores: publicStores }, { status: 200 });
  } catch (error) {
    console.error("Error fetching public stores:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}