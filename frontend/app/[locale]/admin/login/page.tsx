'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { setError('Fill in all fields'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      localStorage.setItem('adminToken', data.token)
      router.push('/admin/dashboard')
    } catch { setError('Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0F0A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'Inter, sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        body { background: #0A0F0A !important; }
        body::before {
          content: ''; position: fixed; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,135,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .inp {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 14px 18px;
          font-size: 14px; color: #F0FFF4;
          width: 100%; outline: none;
          transition: border-color 0.2s;
          font-family: Inter, sans-serif;
        }
        .inp:focus { border-color: rgba(0,255,135,0.4); }
        .inp::placeholder { color: rgba(240,255,244,0.3); }
      `}</style>

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛡️</div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, color: '#F0FFF4', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Admin Portal
          </h1>
          <p style={{ color: 'rgba(240,255,244,0.5)', fontSize: 14 }}>MyCropSage · Restricted Access</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 36 }}>
          {error && (
            <div style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#FF4757' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: 'rgba(240,255,244,0.5)', fontWeight: 500, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Admin Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@mycropsage.com" className="inp" />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 11, color: 'rgba(240,255,244,0.5)', fontWeight: 500, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="inp"
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <button onClick={handleLogin} disabled={loading} style={{
            width: '100%', background: '#00FF87', color: '#0A0F0A',
            padding: '14px 0', borderRadius: 100, fontSize: 14,
            fontWeight: 700, border: 'none', cursor: 'pointer',
            transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Signing in...' : 'Sign In to Admin'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(240,255,244,0.3)' }}>
          Farmer login? <a href="/en/login" style={{ color: '#00FF87', textDecoration: 'none' }}>Go here →</a>
        </p>
      </div>
    </div>
  )
}