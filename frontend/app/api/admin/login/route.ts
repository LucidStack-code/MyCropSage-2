import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const validEmail = process.env.ADMIN_EMAIL
    const validPassword = process.env.ADMIN_PASSWORD
    const secret = process.env.ADMIN_SECRET!

    if (email !== validEmail || password !== validPassword) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { role: 'admin', email },
      secret,
      { expiresIn: '8h' }
    )

    return NextResponse.json({ token })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}