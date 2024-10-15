import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongoose'
import Product from '@/models/Product'

export async function GET(request, { params }) {
  const { productId } = params
  await connectMongo()

  try {
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const { productId } = params
  console.log('Received PUT request for productId:', productId)

  await connectMongo()

  try {
    const updateData = await request.json()
    console.log('Updating product:', productId, 'with data:', updateData)

    if (!productId) {
      console.error('Product ID is undefined')
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true
    })

    if (!product) {
      console.log('Product not found:', productId)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    console.log('Product updated successfully:', product)
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Add DELETE method if needed
