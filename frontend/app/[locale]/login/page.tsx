'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function LoginPage() {
  const t = useTranslations('auth')
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!phone || !password) { setError('Please fill in all fields'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.name || '')
      router.push(`/${locale}/dashboard`)
    } catch { setError('Login failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <>
      <Navbar locale={locale} />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="au1" style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
            <h1 className="syne" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>Welcome back</h1>
            <p style={{ color: 'var(--muted)', fontSize: 15 }}>Sign in to your farm account</p>
          </div>

          <div className="au2 dark-card" style={{ padding: 36 }}>
            {error && (
              <div style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('phone')}
              </label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9999999999" className="dark-input" />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('password')}
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="dark-input"
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>

            <button onClick={handleLogin} disabled={loading} className="btn-primary" style={{ width: '100%', textAlign: 'center', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : t('loginButton')}
            </button>
          </div>

          <div className="au3" style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              {t('noAccount')}{' '}
              <Link href={`/${locale}/register`} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                {t('registerButton')}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}