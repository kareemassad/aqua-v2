// app/api/collections/[collectionId]/items/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/lib/mongoose";
import Collection from "@/models/Collection";
import Product from "@/models/Product";
import { authOptions } from "@/lib/next-auth";

export async function GET(request, { params }) {
  const { collectionId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongo();

    const collection = await Collection.findById(collectionId)
      .populate({
        path: "products",
        populate: { path: "product_id" },
      })
      .exec();

    if (
      !collection ||
      collection.store_id.toString() !== session.user.storeId
    ) {
      return NextResponse.json(
        { error: "Collection not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({ items: collection.products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching collection items:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection items" },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  const { collectionId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongo();

    const { products } = await request.json();

    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 },
      );
    }

    // Filter out products that are already in the collection
    const newProducts = products.filter(
      (productId) => !collection.products.includes(productId),
    );

    // Add only the new products to the collection
    if (newProducts.length > 0) {
      collection.products.push(...newProducts);
      await collection.save();
    }

    return NextResponse.json(
      {
        message:
          newProducts.length > 0
            ? "Products added successfully"
            : "No new products to add",
        addedCount: newProducts.length,
        totalProducts: collection.products.length,
        alreadyInCollection: products.length - newProducts.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error adding products to collection:", error);
    return NextResponse.json(
      { error: "Failed to add products to collection" },
      { status: 500 },
    );
  }
}
