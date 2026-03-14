'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function HistoryPage() {
  const t = useTranslations('history')
  const params = useParams()
  const locale = params.locale as string
  const [detections, setDetections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    fetch('/api/history', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setDetections(data.detections || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const formatDisease = (name: string) => ({
    crop: name?.split('___')[0]?.replace(/_/g, ' ') || '',
    disease: name?.split('___')[1]?.replace(/_/g, ' ') || name,
  })

  return (
    <>
      <Navbar locale={locale} />
      <main className="page" style={{ maxWidth: 800 }}>
        <div className="au1" style={{ marginBottom: 40 }}>
          <div className="eyebrow">Detection History</div>
          <h1 className="syne page-title">{t('title')}</h1>
          <p className="page-subtitle">{detections.length} detections recorded</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => (
              <div key={i} className="dark-card" style={{ height: 88, background: 'rgba(255,255,255,0.03)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : detections.length === 0 ? (
          <div className="dark-card" style={{ padding: '80px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🌱</div>
            <p className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{t('empty')}</p>
          </div>
        ) : (
          <div className="au2" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {detections.map((d, i) => {
              const { crop, disease } = formatDisease(d.diseaseName)
              const isHealthy = disease.toLowerCase().includes('healthy')
              return (
                <div key={d.id} className="dark-card" style={{ display: 'flex', gap: 16, alignItems: 'center', animationDelay: `${i * 0.05}s` }}>
                  {d.imageUrl && (
                    <img src={d.imageUrl} alt={disease} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3 }}>{crop}</p>
                        <p className="syne" style={{ fontSize: 15, fontWeight: 700, color: isHealthy ? 'var(--accent)' : 'var(--warning)' }}>
                          {isHealthy ? '✅' : '⚠️'} {disease}
                        </p>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--muted)', flexShrink: 0, marginLeft: 16 }}>{new Date(d.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
                        <span>{t('confidence')}</span>
                        <span>{d.confidence}%</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 100, height: 3 }}>
                        <div style={{ background: d.confidence > 70 ? 'var(--accent)' : d.confidence > 40 ? 'var(--warning)' : 'var(--danger)', height: '100%', borderRadius: 100, width: `${d.confidence}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}