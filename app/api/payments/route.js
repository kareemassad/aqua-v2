import Payment from "@/models/Payment";
import connectDB from "@/lib/mongoose";

export async function GET(request) {
  try {
    await connectDB();
    const payments = await Payment.find()
      .populate("user_id")
      .populate("subscription_id");
    return new Response(JSON.stringify({ payments }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const newPayment = new Payment(data);
    await newPayment.save();
    return new Response(JSON.stringify(newPayment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
