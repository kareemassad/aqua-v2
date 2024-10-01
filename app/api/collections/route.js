//  handles GET all collections, POST create collection

import Collection from '@/models/Collection';
import connectMongo from '@/lib/mongoose';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import Store from '@/models/Store';
import Product from '@/models/Product';
import CollectionItem from '@/models/CollectionItem';

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectMongo();

        // Fetch the store associated with the user
        const store = await Store.findOne({ user_id: session.user.id });

        if (!store) {
            return NextResponse.json(
                { error: "User's store not found. Please set up your store first." },
                { status: 400 }
            );
        }

        const collections = await Collection.find({ store_id: store._id })
            .populate({
                path: 'products',
                populate: {
                    path: 'product_id',
                    model: Product
                }
            })
            .exec();

        // Add this block to count products for each collection
        const collectionsWithProductCount = await Promise.all(collections.map(async (collection) => {
            const productCount = await CollectionItem.countDocuments({ collection_id: collection._id });
            return {
                ...collection.toObject(),
                productCount
            };
        }));

        return NextResponse.json({ collections: collectionsWithProductCount }, { status: 200 });
    } catch (error) {
        console.error("Error fetching collections:", error);
        return NextResponse.json(
            { error: "Failed to fetch collections" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.error("Unauthorized: No valid session");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session:", JSON.stringify(session, null, 2));

    const { name, password } = await request.json();

    if (!name || !password) {
        console.error("Missing required fields:", { name, password: password ? "provided" : "missing" });
        return NextResponse.json(
            { error: "Name and password are required" },
            { status: 400 }
        );
    }

    try {
        await connectMongo();

        // Fetch the store associated with the user
        const store = await Store.findOne({ user_id: session.user.id });

        if (!store) {
            console.error("Store not found for user");
            return NextResponse.json(
                { error: "User's store not found. Please set up your store first." },
                { status: 400 }
            );
        }

        const newCollection = await Collection.create({
            store_id: store._id,
            name,
            unique_share_url: Math.random().toString(36).substring(2, 15),
            password,
        });

        console.log("Collection created successfully:", newCollection);
        return NextResponse.json(newCollection, { status: 201 });
    } catch (error) {
        console.error("Error creating collection:", error);
        return NextResponse.json(
            { error: "Failed to create collection", details: error.message },
            { status: 500 }
        );
    }
}