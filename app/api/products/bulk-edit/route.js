// /app/api/products/bulk-edit/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectMongo from '@/lib/mongoose'
import Product from '@/models/Product'
import { authOptions } from '@/lib/next-auth'

export async function PUT(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectMongo()

    const { productIds, ...updateData } = await request.json()

    const updatePromises = productIds.map((id) =>
      Product.findByIdAndUpdate(id, updateData, { new: true })
    )

    await Promise.all(updatePromises)

    return NextResponse.json(
      { message: 'Products updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating products:', error)
    return NextResponse.json(
      { error: 'Failed to update products', details: error.message },
      { status: 500 }
    )
  }
}
