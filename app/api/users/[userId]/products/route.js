import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongoose'
import Product from '@/models/Product'

export async function GET(request, props) {
  const params = await props.params;
  await connectMongo()
  const { userId } = params

  try {
    const products = await Product.find({ user_id: userId })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request, props) {
  const params = await props.params;
}
