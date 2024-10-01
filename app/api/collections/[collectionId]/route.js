//  handles DELETE collection

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/lib/mongoose";
import Collection from "@/models/Collection";
import { authOptions } from "@/lib/next-auth";

export async function DELETE(request, { params }) {
  const { collectionId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongo();

    const collection = await Collection.findById(collectionId);

    if (!collection || collection.store_id.toString() !== session.user.storeId) {
      return NextResponse.json(
        { error: "Collection not found or unauthorized" },
        { status: 404 }
      );
    }

    const result = await Collection.deleteOne({ _id: collectionId });

    if (result.deletedCount === 0) {
      console.error(`Failed to delete collection: ${collectionId}`);
      return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
    }

    return NextResponse.json({ message: "Collection deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      { error: "Failed to delete collection", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { collectionId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongo();
    const { name } = await request.json();

    const updatedCollection = await Collection.findByIdAndUpdate(
      collectionId,
      { name },
      { new: true }
    );

    if (!updatedCollection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCollection, { status: 200 });
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    );
  }
}