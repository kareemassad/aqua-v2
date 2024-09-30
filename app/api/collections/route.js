//  handles GET all collections, POST create collection

import Collection from '@/models/Collection';
import connectMongo from '@/lib/mongoose';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectMongo();

        const collections = await Collection.find({ store_id: session.user.storeId })
            .populate('products') // Ensure products are populated
            .exec();

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

    const { name, password } = await request.json();
    const store_id = session.user.storeId;

    console.log("Creating collection:", { store_id, name, password: "***" });

    if (!store_id) {
        console.error("Missing store_id in session");
        return NextResponse.json(
            { error: "User's store not found. Please set up your store first." },
            { status: 400 }
        );
    }

    if (!name || !password) {
        console.error("Missing required fields:", { name, password: password ? "provided" : "missing" });
        return NextResponse.json(
            { error: "Name and password are required" },
            { status: 400 }
        );
    }

    try {
        await connectMongo();

        const newCollection = await Collection.create({
            store_id,
            name,
            unique_link: Math.random().toString(36).substring(2, 15),
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