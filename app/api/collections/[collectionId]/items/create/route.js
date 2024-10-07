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

	console.log("Session:", JSON.stringify(session, null, 2));

	if (!session) {
		console.log("Unauthorized access attempt");
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		await connectMongo();
		console.log("Connected to MongoDB");

		const { product_id } = await request.json();
		console.log("Received product_id:", product_id);

		const collection = await Collection.findById(collectionId);
		console.log("Found collection:", collection);

		if (!collection) {
			console.log("Collection not found");
			return NextResponse.json({ error: "Collection not found", status: "error" }, { status: 404 });
		}

		const store = await Store.findById(collection.store_id);
		console.log("Found store:", store);

		if (store.user_id.toString() !== session.user.id) {
			console.log("Unauthorized: User does not own this store");
			return NextResponse.json({ error: "Unauthorized", status: "error" }, { status: 403 });
		}

		const product = await Product.findById(product_id);
		console.log("Found product:", product);

		if (!product) {
			console.log("Product not found");
			return NextResponse.json({ error: "Product not found", status: "error" }, { status: 404 });
		}

		if (collection.products.includes(product_id)) {
			console.log("Product already in collection");
			return NextResponse.json({ status: "duplicate", message: "Product already in collection" }, { status: 200 });
		}

		collection.products.push(product_id);
		await collection.save();
		console.log("Product added to collection");

		return NextResponse.json({ status: "added", message: "Product added to collection" }, { status: 200 });
	} catch (error) {
		console.error("Error adding product to collection:", error);
		return NextResponse.json({ status: "error", message: "Failed to add product to collection", details: error.message }, { status: 500 });
	}
}