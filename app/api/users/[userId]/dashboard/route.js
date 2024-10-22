import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongoose'
import User from '@/models/User'

export async function GET(request, props) {
  const params = await props.params;
  const { userId } = params
  await connectMongo()

  try {
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
