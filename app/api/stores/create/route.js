import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectMongo from "@/lib/mongoose";
import Store from "@/models/Store";
import { authOptions } from "@/lib/next-auth";
import validator from "validator";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, logo, contact_info, premium } =
    await request.json();

  if (!name || !validator.isLength(name, { min: 3, max: 50 })) {
    return NextResponse.json(
      { error: "Valid store name is required" },
      { status: 400 },
    );
  }

  if (logo && !validator.isURL(logo)) {
    return NextResponse.json(
      { error: "Valid logo URL is required" },
      { status: 400 },
    );
  }

  try {
    await connectMongo();

    const newStore = await Store.create({
      user_id: session.user.id,
      name: validator.escape(name),
      description: validator.escape(description || ""),
      logo: validator.escape(logo || ""),
      public: Boolean(premium),
      contact_info: {
        phone: contact_info.phone ? validator.escape(contact_info.phone) : "",
        email:
          contact_info.email && validator.isEmail(contact_info.email)
            ? validator.normalizeEmail(contact_info.email)
            : "",
      },
    });

    return NextResponse.json(newStore, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 },
    );
  }
}
