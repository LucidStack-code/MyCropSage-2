'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const LOCALE_FLAGS: Record<string, string> = {
  hi: '🇮🇳 Hindi', mr: '🇮🇳 Marathi',
  te: '🇮🇳 Telugu', ta: '🇮🇳 Tamil', en: '🌐 English'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'detections' | 'users'>('overview')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) { router.push('/admin/login'); return }

    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) { router.push('/admin/login'); return }
        setData(d); setLoading(false)
      })
      .catch(() => { router.push('/admin/login') })
  }, [])

  const logout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0F0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(0,255,135,0.2)', borderTopColor: '#00FF87', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(240,255,244,0.5)', fontSize: 14 }}>Loading admin panel...</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'detections', label: 'All Detections', icon: '🔬' },
    { id: 'users', label: 'All Farmers', icon: '👥' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0A0F0A', fontFamily: 'Inter, sans-serif', color: '#F0FFF4' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        body { background: #0A0F0A !important; margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0A0F0A; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,135,0.2); border-radius: 3px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .row:hover { background: rgba(0,255,135,0.03) !important; }
      `}</style>

      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 40px',
        background: 'rgba(10,15,10,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>🛡️</span>
          <span style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, background: 'linear-gradient(135deg,#00FF87,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MyCropSage Admin
          </span>
          <span style={{ fontSize: 11, background: 'rgba(0,255,135,0.1)', color: '#00FF87', padding: '3px 10px', borderRadius: 100, fontWeight: 600 }}>
            RESTRICTED
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="/en" style={{ fontSize: 13, color: 'rgba(240,255,244,0.5)', textDecoration: 'none' }}>← Back to App</a>
          <button onClick={logout} style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', color: '#FF4757', padding: '7px 16px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ paddingTop: 80, padding: '80px 40px 40px' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40, animation: 'fadeUp 0.5s ease both' }}>
          {[
            { num: data.totalUsers, label: 'Total Farmers', icon: '👥', color: '#00FF87' },
            { num: data.totalDetections, label: 'Total Detections', icon: '🔬', color: '#00D4FF' },
            { num: data.topDiseases[0]?.name || '—', label: 'Top Disease', icon: '⚠️', color: '#FFAA00', small: true },
            { num: data.topDiseases.length, label: 'Disease Types Found', icon: '🧬', color: '#7B2FFF' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '24px 20px', transition: 'all 0.2s', animationDelay: `${i * 0.08}s` }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne', fontSize: s.small ? 20 : 40, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 6, letterSpacing: '-0.02em' }}>{s.num}</div>
              <div style={{ fontSize: 12, color: 'rgba(240,255,244,0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
              padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: activeTab === tab.id ? 'rgba(0,255,135,0.12)' : 'transparent',
              color: activeTab === tab.id ? '#00FF87' : 'rgba(240,255,244,0.5)',
              fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Top diseases */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Top Detected Diseases</h3>
              {data.topDiseases.length === 0 ? (
                <p style={{ color: 'rgba(240,255,244,0.4)', fontSize: 13 }}>No detections yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {data.topDiseases.map((d: any, i: number) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ fontWeight: 500 }}>{d.name}</span>
                        <span style={{ color: 'rgba(240,255,244,0.5)' }}>{d.count} cases</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 100, height: 4 }}>
                        <div style={{
                          background: 'linear-gradient(90deg,#00FF87,#00D4FF)',
                          height: '100%', borderRadius: 100,
                          width: `${(d.count / data.totalDetections) * 100}%`,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Language breakdown */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Farmers by Language</h3>
              {data.recentUsers.length === 0 ? (
                <p style={{ color: 'rgba(240,255,244,0.4)', fontSize: 13 }}>No users yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.entries(
                    data.recentUsers.reduce((acc: any, u: any) => {
                      acc[u.preferredLocale] = (acc[u.preferredLocale] || 0) + 1
                      return acc
                    }, {})
                  ).map(([locale, count]: any) => (
                    <div key={locale} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                      <span style={{ fontSize: 13 }}>{LOCALE_FLAGS[locale] || locale}</span>
                      <span style={{ fontFamily: 'Syne', fontWeight: 700, color: '#00FF87' }}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detections Tab */}
        {activeTab === 'detections' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700 }}>Recent Detections</h3>
              <span style={{ fontSize: 12, color: 'rgba(240,255,244,0.4)' }}>Last 20 records</span>
            </div>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr', padding: '12px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Farmer', 'Disease', 'Confidence', 'Language', 'Date'].map(h => (
                <span key={h} style={{ fontSize: 11, color: 'rgba(240,255,244,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>
            {data.recentDetections.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(240,255,244,0.4)', fontSize: 14 }}>No detections yet</div>
            ) : (
              data.recentDetections.map((d: any, i: number) => (
                <div key={d.id} className="row" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr', padding: '14px 24px', borderBottom: i < data.recentDetections.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{d.farmerName}</p>
                    <p style={{ fontSize: 11, color: 'rgba(240,255,244,0.4)', marginTop: 2 }}>{d.farmerPhone}</p>
                  </div>
                  <p style={{ fontSize: 13, alignSelf: 'center' }}>{d.disease}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, alignSelf: 'center', color: d.confidence > 70 ? '#00FF87' : d.confidence > 40 ? '#FFAA00' : '#FF4757' }}>
                    {d.confidence}%
                  </p>
                  <p style={{ fontSize: 12, alignSelf: 'center', color: 'rgba(240,255,244,0.6)' }}>{LOCALE_FLAGS[d.locale] || d.locale}</p>
                  <p style={{ fontSize: 12, alignSelf: 'center', color: 'rgba(240,255,244,0.4)' }}>{new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700 }}>Registered Farmers</h3>
              <span style={{ fontSize: 12, color: 'rgba(240,255,244,0.4)' }}>Last 10 registered</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.5fr', padding: '12px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Name', 'Phone', 'Language', 'Detections', 'Joined'].map(h => (
                <span key={h} style={{ fontSize: 11, color: 'rgba(240,255,244,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>
            {data.recentUsers.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(240,255,244,0.4)', fontSize: 14 }}>No farmers registered yet</div>
            ) : (
              data.recentUsers.map((u: any, i: number) => (
                <div key={u.id} className="row" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.5fr', padding: '14px 24px', borderBottom: i < data.recentUsers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,255,135,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</span>
                  </div>
                  <p style={{ fontSize: 13, alignSelf: 'center', color: 'rgba(240,255,244,0.7)' }}>{u.phone}</p>
                  <p style={{ fontSize: 12, alignSelf: 'center' }}>{LOCALE_FLAGS[u.preferredLocale] || u.preferredLocale}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, alignSelf: 'center', color: '#00FF87' }}>{u._count.detections}</p>
                  <p style={{ fontSize: 12, alignSelf: 'center', color: 'rgba(240,255,244,0.4)' }}>{new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
