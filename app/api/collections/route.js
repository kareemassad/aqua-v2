//  handles GET all collections, POST create collection

import Collection from '@/models/Collection';
import connectMongo from '@/lib/mongoose';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import Store from '@/models/Store';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectMongo();

        const store = await Store.findOne({ user_id: session.user.id });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const collections = await Collection.find({ store_id: store._id })
            .populate({
                path: 'products',
                model: 'Product'
            })
            .lean();

        console.log("Fetched collections:", JSON.stringify(collections, null, 2));

        return NextResponse.json({ collections }, { status: 200 });
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

    const { name } = await request.json(); 
    console.log("Creating collection:", { name });

    if (!name) {
        console.error("Missing required field: name");
        return NextResponse.json(
            { error: "Name is required" },
            { status: 400 }
        );
    }

    try {
        await connectMongo();

        // Fetch the store associated with the user
        const store = await Store.findOne({ user_id: session.user.id });

        if (!store) {
            console.error("Store not found for user:", session.user.id);
            return NextResponse.json(
                { error: "User's store not found. Please set up your store first." },
                { status: 400 }
            );
        }

        const newCollection = await Collection.create({
            store_id: store._id,
            name,
            unique_link: uuidv4()
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