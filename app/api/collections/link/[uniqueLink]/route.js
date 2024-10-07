import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Collection from "@/models/Collection";

export async function GET(request, { params }) {
  const { uniqueLink } = params;

  try {
    await connectMongo();

    const collection = await Collection.findOne({ unique_link: uniqueLink }).populate('products').exec();

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({ collection }, { status: 200 });
  } catch (error) {
    console.error("Error fetching collection via unique link:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}