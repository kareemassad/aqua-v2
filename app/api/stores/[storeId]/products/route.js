import Product from '@/models/Product';
import connectDB from '@/libs/mongoose';

export async function GET(request, { params }) {
    const { storeId } = params;
    try {
        await connectDB();
        const products = await Product.find({ store_id: storeId });
        return new Response(JSON.stringify({ products }), {
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