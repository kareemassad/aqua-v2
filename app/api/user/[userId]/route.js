import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import dbConnect from "@/libs/dbConnect"; // Change this import
import User from "@/models/User";
import Store from "@/models/Store"; // Added import for Store model
import Product from "@/models/Product"; // Added import for Product model

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await dbConnect();
    const store = await Store.findOne({ user_id: session.user.id });
    if (!store) {
      return new Response(JSON.stringify({ error: "Store not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const products = await Product.find({ store_id: store._id }).lean();

    return new Response(JSON.stringify({ products }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/user/[userId]:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}