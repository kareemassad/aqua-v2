import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongoose'
import Collection from '@/models/Collection'
import Link from '@/models/Link'

export async function GET(request, { params }) {
  const { linkId } = params

  try {
    await connectMongo()

    const link = await Link.findOne({ linkId }).populate('collectionId')
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const collection = await Collection.findById(link.collectionId)
      .populate('products')
      .lean()

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    // Update click count
    link.clickCount += 1
    link.lastClickedAt = new Date()
    await link.save()

    return NextResponse.json({ collection }, { status: 200 })
  } catch (error) {
    console.error('Error fetching collection via link:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
