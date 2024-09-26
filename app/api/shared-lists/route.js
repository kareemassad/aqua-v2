import SharedList from '../../../models/SharedList';
import connectDB from '../../../config/database';

export async function GET(request) {
    try {
        await connectDB();
        const sharedLists = await SharedList.find().populate('store_id');
        return new Response(JSON.stringify({ sharedLists }), {
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
        const newSharedList = new SharedList(data);
        await newSharedList.save();
        return new Response(JSON.stringify(newSharedList), {
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