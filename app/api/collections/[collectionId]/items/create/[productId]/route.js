//  handles DELETE item from collection

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectMongo from '@/lib/mongoose'
import Collection from '@/models/Collection'
import CollectionItem from '@/models/CollectionItem'
import { authOptions } from '@/lib/next-auth'

export async function DELETE(request, { params }) {
  const { collectionId, productId } = params
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectMongo()

    const collection = await Collection.findById(collectionId)

    if (
      !collection ||
      collection.store_id.toString() !== session.user.storeId
    ) {
      return NextResponse.json(
        { error: 'Collection not found or unauthorized' },
        { status: 404 }
      )
    }

    const collectionItem = await CollectionItem.findOneAndDelete({
      collection_id: collectionId,
      product_id: productId
    })

    if (!collectionItem) {
      return NextResponse.json(
        { error: 'Product not found in the collection' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Product removed from collection' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error removing product from collection:', error)
    return NextResponse.json(
      { error: 'Failed to remove product from collection' },
      { status: 500 }
    )
  }
}
