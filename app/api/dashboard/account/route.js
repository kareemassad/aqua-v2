import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectMongo from '@/lib/mongoose'
import User from '@/models/User'
import Store from '@/models/Store'
import { authOptions } from '@/lib/next-auth'

export async function GET(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectMongo()

    // Fetch user data
    const user = await User.findById(session.user.id).lean()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch store data
    const store = await Store.findOne({ user_id: session.user.id }).lean()
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Prepare the account data
    const accountData = {
      user: {
        email: user.email,
        profilePicture: user.profilePicture || ''
      },
      store: {
        name: store.name,
        description: store.description || ''
      }
    }

    return NextResponse.json({ accountData }, { status: 200 })
  } catch (error) {
    console.error('Error fetching account data:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}

// Added PUT handler to handle account updates
export async function PUT(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { email, storeName, storeDescription, profilePicture } =
      await request.json()
    await connectMongo()

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { email, profilePicture },
      { new: true, runValidators: true }
    ).lean()

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update store data
    const updatedStore = await Store.findOneAndUpdate(
      { user_id: session.user.id },
      { name: storeName, description: storeDescription },
      { new: true, runValidators: true }
    ).lean()

    if (!updatedStore) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Prepare the updated account data
    const accountData = {
      user: {
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture || ''
      },
      store: {
        name: updatedStore.name,
        description: updatedStore.description || ''
      }
    }

    return NextResponse.json({ accountData }, { status: 200 })
  } catch (error) {
    console.error('Error updating account data:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}
