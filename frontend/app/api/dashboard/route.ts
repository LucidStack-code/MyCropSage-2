import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const detections = await prisma.detection.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate stats
    const totalDetections = detections.length
    const lastDetection = detections[0] || null

    // Find most common disease
    const diseaseCounts: Record<string, number> = {}
    detections.forEach((d) => {
      diseaseCounts[d.diseaseName] = (diseaseCounts[d.diseaseName] || 0) + 1
    })
    const mostCommonDisease = Object.entries(diseaseCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null

    // Recent 5 for chart
    const recentDiseases = detections.slice(0, 5).map((d) => ({
      name: d.diseaseName.split('___')[1]?.replace(/_/g, ' ') || d.diseaseName,
      confidence: d.confidence,
      date: d.createdAt,
    }))

    return NextResponse.json({
      totalDetections,
      lastDetection,
      mostCommonDisease,
      recentDiseases,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard' },
      { status: 500 }
    )
  }
}