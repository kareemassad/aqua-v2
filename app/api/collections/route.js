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
            .populate('products')
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
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectMongo();

        const { name, password } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Missing name" }, { status: 400 });
        }

        const newCollection = await Collection.create({
            store_id: session.user.storeId,
            name,
            unique_link: Math.random().toString(36).substring(2, 15),
            password,
        });

        return NextResponse.json(newCollection, { status: 201 });
    } catch (error) {
        console.error("Error creating collection:", error);
        return NextResponse.json(
            { error: "Failed to create collection", details: error.message },
            { status: 500 }
        );
    }
}