import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/libs/mongoose";
import Collection from "@/models/Collection";
import { authOptions } from "@/libs/next-auth";
import { v4 as uuidv4 } from "uuid";
import Store from "@/models/Store";
import validator from "validator";
import bcrypt from "bcrypt"; // Import bcrypt for hashing

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { store_id, name, expiration_date, password } = await request.json();

  if (!store_id || !name || !password) {
    return NextResponse.json(
      { error: "Store ID, Shared List name, and password are required" },
      { status: 400 }
    );
  }

  // Validate password strength (e.g., minimum length)
  if (typeof password !== 'string' || password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters long" },
      { status: 400 }
    );
  }

  // Validate expiration_date if provided
  if (expiration_date) {
    const expDate = new Date(expiration_date);
    if (isNaN(expDate.getTime()) || expDate <= new Date()) {
      return NextResponse.json(
        { error: "Invalid expiration date. Must be a future date." },
        { status: 400 }
      );
    }
  }

  try {
    await connectMongo();

    // Verify that the store belongs to the user
    const store = await Store.findOne({ _id: store_id, user_id: session.user.id });
    if (!store) {
      return NextResponse.json(
        { error: "Store not found or unauthorized" },
        { status: 404 }
      );
    }

    const unique_link = uuidv4();

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newCollection = await Collection.create({
      store_id,
      name: validator.escape(name),
      unique_link,
      expiration_date: expiration_date ? new Date(expiration_date) : null,
      password: hashedPassword, // Store hashed password
    });

    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create shared list" },
      { status: 500 }
    );
  }
}