import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/lib/mongoose";
import Collection from "@/models/Collection";
import { authOptions } from "@/lib/next-auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request, { params }) {
  const { collectionId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongo();

    const collection = await Collection.findOne({
      _id: collectionId,
      store_id: session.user.storeId,
    });

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found or unauthorized" },
        { status: 404 },
      );
    }

    const uniqueLink = uuidv4();
    collection.unique_link = uniqueLink;
    await collection.save();

    return NextResponse.json({ uniqueLink }, { status: 200 });
  } catch (error) {
    console.error("Error generating unique link:", error);
    return NextResponse.json(
      { error: "Failed to generate unique link" },
      { status: 500 },
    );
  }
}
