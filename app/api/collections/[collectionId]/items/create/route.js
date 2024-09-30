// //  handles POST create item in collection
// TODO, DELETE AS PRODUCT CREATION IS NOW DONE IN collections/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/lib/mongoose";
import Collection from "@/models/Collection";
import Product from "@/models/Product";
import CollectionItem from "@/models/CollectionItem";
import { authOptions } from "@/lib/next-auth";

export async function POST(request, { params }) {
  const { collectionId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    console.error("Unauthorized: No valid session");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Session user:", session.user);
  console.log("Collection ID:", collectionId);

  const { product_id, custom_price } = await request.json();
  console.log("Received payload:", { product_id, custom_price });

  if (!product_id || custom_price == null) {
    console.error("Missing required fields:", { product_id, custom_price });
    return NextResponse.json(
      { error: "Product ID and Custom Price are required" },
      { status: 400 }
    );
  }

  // Validate custom_price is a positive number
  if (typeof custom_price !== 'number' || custom_price < 0) {
    return NextResponse.json(
      { error: "Custom Price must be a positive number" },
      { status: 400 }
    );
  }

  try {
    await connectMongo();

    // Verify that the collection belongs to the user
    const collection = await Collection.findById(collectionId);
    console.log("Found collection:", collection);

    if (!collection) {
      console.error("Collection not found:", collectionId);
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    if (collection.store_id.toString() !== session.user.storeId) {
      console.error("Unauthorized: Collection store_id does not match user's storeId");
      console.log("Collection store_id:", collection.store_id.toString());
      console.log("User storeId:", session.user.storeId);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Verify that the product exists and belongs to the store
    const product = await Product.findOne({ _id: product_id, store_id: collection.store_id }).exec();
    if (!product) {
      return NextResponse.json(
        { error: "Product not found in the specified store" },
        { status: 404 }
      );
    }

    // Check for duplicate CollectionItem
    const existingItem = await CollectionItem.findOne({
      collection_id: collectionId,
      product_id,
    }).exec();

    if (existingItem) {
      return NextResponse.json(
        { error: "Product is already in the collection" },
        { status: 400 }
      );
    }

    const newCollectionItem = await CollectionItem.create({
      collection_id: collectionId,
      product_id,
      custom_price,
    });

    return NextResponse.json(newCollectionItem, { status: 201 });
  } catch (error) {
    console.error("Error creating collection item:", error);
    return NextResponse.json(
      { error: "Failed to create collection item", details: error.message },
      { status: 500 }
    );
  }
}