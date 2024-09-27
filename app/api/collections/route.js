import Collection from '@/models/Collection';
import connectDB from '@/libs/mongoose';

export async function GET(request) {
    try {
        await connectDB();
        const collections = await Collection.find().populate('store_id');
        return new Response(JSON.stringify({ collections }), {
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
        const newCollection = new Collection(data);
        await newCollection.save();
        return new Response(JSON.stringify(newCollection), {
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