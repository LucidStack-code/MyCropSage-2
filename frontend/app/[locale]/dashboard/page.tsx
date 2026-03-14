'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface DashboardData {
  totalDetections: number
  lastDetection: any
  mostCommonDisease: string | null
  recentDiseases: Array<{ name: string; confidence: number; date: string }>
}

export default function DashboardPage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('navigation')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('userName')
    if (name) setUserName(name)
    if (!token) { setLoading(false); return }

    fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (!d.error) setData({ totalDetections: d.totalDetections || 0, lastDetection: d.lastDetection || null, mostCommonDisease: d.mostCommonDisease || null, recentDiseases: d.recentDiseases || [] })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const formatDisease = (name: string) =>
    name?.split('___')[1]?.replace(/_/g, ' ') || name

  const quickActions = [
    { href: `/${locale}/detect`, icon: '🔬', label: t('detect'), desc: 'Upload or speak' },
    { href: `/${locale}/weather`, icon: '🌤️', label: t('weather'), desc: 'Farming advice' },
    { href: `/${locale}/stores`, icon: '🏪', label: t('stores'), desc: 'Find nearby' },
    { href: `/${locale}/history`, icon: '📋', label: t('history'), desc: 'Past detections' },
  ]

  return (
    <>
      <Navbar locale={locale} />
      <main className="page">
        {/* Header */}
        <div className="au1" style={{ marginBottom: 48 }}>
          <div className="eyebrow">Dashboard</div>
          <h1 className="syne page-title">
            {userName ? `Welcome back, ${userName} 👋` : 'Your Farm Overview'}
          </h1>
          <p className="page-subtitle">AI-powered insights for your crops</p>
        </div>

        {/* Stats */}
        <div className="au2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 48 }}>
          {[
            { num: data?.totalDetections || 0, label: 'Total Detections', icon: '🔬', accent: true },
            { num: data?.mostCommonDisease ? formatDisease(data.mostCommonDisease) : '—', label: 'Most Common Issue', icon: '⚠️', accent: false },
            { num: data?.lastDetection ? new Date(data.lastDetection.createdAt).toLocaleDateString() : '—', label: 'Last Detection', icon: '📅', accent: false },
          ].map((s, i) => (
            <div key={i} className="dark-card" style={{ padding: '28px 24px' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{s.icon}</div>
              <div className="syne" style={{
                fontSize: typeof s.num === 'number' ? 48 : 22,
                fontWeight: 800, lineHeight: 1,
                color: s.accent ? 'var(--accent)' : 'var(--text)',
                marginBottom: 6, letterSpacing: '-0.02em'
              }}>{s.num}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="au3" style={{ marginBottom: 48 }}>
          <h2 className="syne" style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, letterSpacing: '-0.01em' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {quickActions.map(a => (
              <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
                <div className="dark-card" style={{ textAlign: 'center', padding: '28px 16px', cursor: 'pointer' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{a.icon}</div>
                  <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{a.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{a.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent detections */}
        {data && data.recentDiseases.length > 0 && (
          <div className="au4">
            <h2 className="syne" style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, letterSpacing: '-0.01em' }}>Recent Detections</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
              {data.recentDiseases.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '18px 24px',
                  borderBottom: i < data.recentDiseases.length - 1 ? '1px solid var(--border)' : 'none',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}>
                  <div>
                    <p className="syne" style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, fontSize: 16, color: item.confidence > 70 ? 'var(--accent)' : item.confidence > 40 ? 'var(--warning)' : 'var(--danger)' }}>
                      {item.confidence}%
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--muted)' }}>confidence</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}