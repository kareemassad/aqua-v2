import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Collection from "@/models/Collection";

export async function GET(request, { params }) {
  const { linkId } = params;

  try {
    await connectMongo();

    const collection = await Collection.findOne({ "uniqueLinks.linkId": linkId }).populate('products').lean();
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    // Track the click
    const link = collection.uniqueLinks.find(l => l.linkId === linkId);
    if (link) {
      link.clickCount += 1;
      link.lastClickedAt = new Date();
      await collection.save();
    }

    return NextResponse.json({ collection }, { status: 200 });
  } catch (error) {
    console.error("Error fetching collection via link:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}