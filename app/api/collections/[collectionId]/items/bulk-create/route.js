import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/lib/mongoose";
import Collection from "@/models/Collection";
import Product from "@/models/Product";
import Store from "@/models/Store";
import { authOptions } from "@/lib/next-auth";

export async function POST(request, { params }) {
  const { collectionId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongo();
    const { product_ids } = await request.json();

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const store = await Store.findById(collection.store_id);
    if (store.user_id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const addedProducts = [];
    const duplicateProducts = [];

    for (const productId of product_ids) {
      const product = await Product.findById(productId);
      if (!product) {
        continue; // Skip if product not found
      }

      if (!collection.products.includes(productId)) {
        collection.products.push(productId);
        addedProducts.push(productId);
      } else {
        duplicateProducts.push(productId);
      }
    }

    await collection.save();

    return NextResponse.json({
      status: "success",
      added: addedProducts.length,
      duplicates: duplicateProducts.length,
    }, { status: 200 });
  } catch (error) {
    console.error("Error adding products to collection:", error);
    return NextResponse.json({ error: "Failed to add products to collection", details: error.message }, { status: 500 });
  }
}
