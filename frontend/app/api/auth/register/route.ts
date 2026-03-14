import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password, locale } = await req.json()

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { phone } })
    if (existing) {
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        passwordHash,
        preferredLocale: locale || 'hi',
      },
    })

    const token = signToken({ userId: user.id, locale: user.preferredLocale })

    return NextResponse.json({
      token,
      userId: user.id,
      locale: user.preferredLocale,
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}