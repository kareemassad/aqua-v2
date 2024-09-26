import Subscription from '../../../models/Subscription';
import connectDB from '../../../config/database';

export async function GET(request) {
    try {
        await connectDB();
        const subscriptions = await Subscription.find();
        return new Response(JSON.stringify({ subscriptions }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        const newSubscription = new Subscription(data);
        await newSubscription.save();
        return new Response(JSON.stringify(newSubscription), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}