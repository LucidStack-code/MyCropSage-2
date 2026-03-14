import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text, locale } = await req.json()

    const fastapiUrl = process.env.FASTAPI_URL || 'http://localhost:8000'

    const response = await fetch(`${fastapiUrl}/speech/analyze-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, locale }),
    })

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Speech analyze error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}