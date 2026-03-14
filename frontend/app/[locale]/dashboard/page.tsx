'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface DashboardData {
  totalDetections: number
  lastDetection: any
  mostCommonDisease: string | null
  recentDiseases: Array<{
    name: string
    confidence: number
    date: string
  }>
}

export default function DashboardPage() {
  const t = useTranslations('navigation')
  const params = useParams()
  const locale = params.locale as string
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('userName')
    if (name) setUserName(name)

    if (!token) {
      setLoading(false)
      return
    }

    fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
            setLoading(false)
            return
        }
        setData({
            totalDetections: d.totalDetections || 0,
            lastDetection: d.lastDetection || null,
            mostCommonDisease: d.mostCommonDisease || null,
            recentDiseases: d.recentDiseases || [],
        })
        setLoading(false)
    })
      .catch(() => setLoading(false))
  }, [])

  const formatDisease = (name: string) => {
    return name?.split('___')[1]?.replace(/_/g, ' ') || name
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-32" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-700">
            🌿 MyCropSage
          </h1>
          {userName && (
            <p className="text-gray-600 mt-1">
              Welcome, {userName} 👋
            </p>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-green-600">
              {data?.totalDetections || 0}
            </p>
            <p className="text-gray-500 text-sm mt-1">Total Detections</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-amber-600 truncate">
              {data?.mostCommonDisease
                ? formatDisease(data.mostCommonDisease)
                : '—'}
            </p>
            <p className="text-gray-500 text-sm mt-1">Most Common Issue</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-blue-600">
              {data?.lastDetection
                ? new Date(data.lastDetection.createdAt).toLocaleDateString()
                : '—'}
            </p>
            <p className="text-gray-500 text-sm mt-1">Last Detection</p>
          </div>
        </div>

        {/* Quick actions */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { href: `/${locale}/detect`, icon: '🔬', label: t('detect') },
            { href: `/${locale}/weather`, icon: '🌤️', label: t('weather') },
            { href: `/${locale}/stores`, icon: '🏪', label: t('stores') },
            { href: `/${locale}/history`, icon: '📋', label: t('history') },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-green-400 hover:shadow-md transition text-center"
            >
              <p className="text-3xl mb-2">{action.icon}</p>
              <p className="text-sm font-medium text-gray-700">{action.label}</p>
            </Link>
          ))}
        </div>

        {/* Recent detections */}
        {data && data.recentDiseases && data.recentDiseases.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Detections
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {data.recentDiseases.map((item, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-4 ${
                    i < data.recentDiseases.length - 1
                      ? 'border-b border-gray-100'
                      : ''
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      item.confidence > 70
                        ? 'text-green-600'
                        : item.confidence > 40
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}>
                      {item.confidence}%
                    </p>
                    <p className="text-xs text-gray-400">confidence</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}