import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectMongo from '@/lib/mongoose'
import Collection from '@/models/Collection'
import Link from '@/models/Link'
import { authOptions } from '@/lib/next-auth'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectMongo()

    const links = await Link.find({ userId: session.user.id })
      .populate('collectionId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ links }, { status: 200 })
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectMongo()

    const { collectionId, isPublic } = await request.json()

    const collection = await Collection.findById(collectionId)
    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    const linkId = uuidv4()
    const newLink = new Link({
      userId: session.user.id,
      collectionId,
      linkId,
      isPublic,
      clickCount: 0
    })

    await newLink.save()

    return NextResponse.json(newLink, { status: 201 })
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    )
  }
}
