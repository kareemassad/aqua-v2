import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import connectMongo from "@/lib/mongoose";
import Store from "@/models/Store";
import validator from "validator";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { storeId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, logo, contact_info, premium } =
    await request.json();

  try {
    await connectMongo();

    const store = await Store.findOne({
      _id: storeId,
      user_id: session.user.id,
    });
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (name) store.name = validator.escape(name);
    if (description) store.description = validator.escape(description);
    if (logo) store.logo = validator.escape(logo);
    if (contact_info) {
      store.contact_info.phone = contact_info.phone
        ? validator.escape(contact_info.phone)
        : store.contact_info.phone;
      store.contact_info.email =
        contact_info.email && validator.isEmail(contact_info.email)
          ? validator.normalizeEmail(contact_info.email)
          : store.contact_info.email;
    }
    if (typeof premium === "boolean") store.premium = premium; // Update public flag

    await store.save();

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 },
    );
  }
}
