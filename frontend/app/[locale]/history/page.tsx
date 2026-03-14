'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import HistoryCard from '@/components/HistoryCard'

export default function HistoryPage() {
  const t = useTranslations('history')
  const [detections, setDetections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    fetch('/api/history', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setDetections(data.detections || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-6">
            📋 {t('title')}
          </h1>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          📋 {t('title')}
        </h1>

        {detections.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-5xl mb-4">🌱</p>
            <p className="text-gray-500">{t('empty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {detections.map((detection) => (
              <HistoryCard key={detection.id} detection={detection} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}