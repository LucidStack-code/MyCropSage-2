import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return false
  try {
    const payload = jwt.verify(token, process.env.ADMIN_SECRET!) as any
    return payload.role === 'admin'
  } catch { return false }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [totalUsers, totalDetections, recentDetections, recentUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.detection.count(),
        prisma.detection.findMany({
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: { user: { select: { name: true, phone: true } } },
        }),
        prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true, name: true, phone: true,
            preferredLocale: true, createdAt: true,
            _count: { select: { detections: true } }
          },
        }),
      ])

    // Disease frequency
    const allDetections = await prisma.detection.findMany({
      select: { diseaseName: true }
    })
    const diseaseCounts: Record<string, number> = {}
    allDetections.forEach(d => {
      diseaseCounts[d.diseaseName] = (diseaseCounts[d.diseaseName] || 0) + 1
    })
    const topDiseases = Object.entries(diseaseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name: name.split('___')[1]?.replace(/_/g, ' ') || name,
        count
      }))

    // Detections per day (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentByDay = await prisma.detection.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    })
    const byDay: Record<string, number> = {}
    recentByDay.forEach(d => {
      const day = d.createdAt.toISOString().split('T')[0]
      byDay[day] = (byDay[day] || 0) + 1
    })

    return NextResponse.json({
      totalUsers,
      totalDetections,
      topDiseases,
      detectionsByDay: byDay,
      recentDetections: recentDetections.map(d => ({
        id: d.id,
        farmerName: d.user.name,
        farmerPhone: d.user.phone,
        disease: d.diseaseName.split('___')[1]?.replace(/_/g, ' ') || d.diseaseName,
        confidence: d.confidence,
        locale: d.locale,
        createdAt: d.createdAt,
      })),
      recentUsers,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}