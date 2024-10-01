import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/lib/mongoose";
import Collection from "@/models/Collection";
import { authOptions } from "@/lib/next-auth";

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectMongo();

        const { collectionId, productId } = await request.json();

        if (!collectionId || !productId) {
            return NextResponse.json({ error: "Missing collectionId or productId" }, { status: 400 });
        }

        const updatedCollection = await Collection.findByIdAndUpdate(
            collectionId,
            { $addToSet: { products: productId } },
            { new: true }
        ).populate('products');

        if (!updatedCollection) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCollection, { status: 200 });
    } catch (error) {
        console.error("Error adding product to collection:", error);
        return NextResponse.json(
            { error: "Failed to add product to collection" },
            { status: 500 }
        );
  }
}
