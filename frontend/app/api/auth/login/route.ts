import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { phone } })
    if (!user) {
      return NextResponse.json(
        { error: 'Phone number not found' },
        { status: 404 }
      )
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }

    const token = signToken({ userId: user.id, locale: user.preferredLocale })

    return NextResponse.json({
      token,
      userId: user.id,
      name: user.name,
      locale: user.preferredLocale,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}