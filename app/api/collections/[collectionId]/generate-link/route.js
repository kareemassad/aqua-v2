import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectMongo from '@/lib/mongoose'
import Collection from '@/models/Collection'
import Store from '@/models/Store'
import { authOptions } from '@/lib/next-auth'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request, { params }) {
  const { collectionId } = params
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectMongo()

    console.log('Session:', JSON.stringify(session, null, 2))
    console.log('CollectionId:', collectionId)

    // Find the store associated with the user
    const store = await Store.findOne({ user_id: session.user.id })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found for user' },
        { status: 404 }
      )
    }

    const collection = await Collection.findOne({
      _id: collectionId,
      store_id: store._id
    })

    if (!collection) {
      console.log('Collection not found:', collectionId)
      return NextResponse.json(
        { error: 'Collection not found or unauthorized' },
        { status: 404 }
      )
    }

    const uniqueLink = uuidv4()

    // Update the collection with the new unique link
    collection.unique_link = uniqueLink

    // Add the new link to the uniqueLinks array
    collection.uniqueLinks.push({
      linkId: uniqueLink,
      createdAt: new Date(),
      clickCount: 0
    })

    await collection.save()
    return NextResponse.json({ uniqueLink }, { status: 200 })
  } catch (error) {
    console.error('Error generating unique link:', error)
    return NextResponse.json(
      { error: 'Failed to generate unique link', details: error.message },
      { status: 500 }
    )
  }
}
