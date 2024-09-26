import Store from '@/models/Store';
import connectDB from '@/libs/mongoose';

export async function GET(request) {
    try {
        await connectDB();
        const stores = await Store.find().populate('user_id');
        return new Response(JSON.stringify({ stores }), {
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
        const newStore = new Store(data);
        await newStore.save();
        return new Response(JSON.stringify(newStore), {
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