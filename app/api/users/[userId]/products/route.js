import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongoose'
import Product from '@/models/Product'

export async function GET(request, { params }) {
  await connectMongo()
  const { userId } = params

  try {
    const products = await Product.find({ user_id: userId })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  // Add logic to create a product for a specific user
}
