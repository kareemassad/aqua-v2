import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/libs/mongoose";
import SharedListItem from "@/models/SharedListItem";
import SharedList from "@/models/SharedList";
import Product from "@/models/Product";
import { authOptions } from "@/libs/next-auth";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { shared_list_id, product_id, custom_price } = await request.json();

  if (!shared_list_id || !product_id || custom_price == null) {
    return NextResponse.json(
      { error: "Shared List ID, Product ID, and Custom Price are required" },
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

    // Verify that the shared list belongs to the user
    const sharedList = await SharedList.findOne({ _id: shared_list_id })
      .populate("store_id")
      .exec();
    if (!sharedList || sharedList.store_id.user_id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Shared List not found or unauthorized" },
        { status: 404 }
      );
    }

    // Verify that the product exists and belongs to the store
    const product = await Product.findOne({ _id: product_id, store_id: sharedList.store_id._id }).exec();
    if (!product) {
      return NextResponse.json(
        { error: "Product not found in the specified store" },
        { status: 404 }
      );
    }

    // Check for duplicate SharedListItem
    const existingItem = await SharedListItem.findOne({
      shared_list_id,
      product_id,
    }).exec();

    if (existingItem) {
      return NextResponse.json(
        { error: "Product is already in the shared list" },
        { status: 400 }
      );
    }

    const newSharedListItem = await SharedListItem.create({
      shared_list_id,
      product_id,
      custom_price,
    });

    return NextResponse.json(newSharedListItem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create shared list item" },
      { status: 500 }
    );
  }
}