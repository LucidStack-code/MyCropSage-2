'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
]

export default function RegisterPage() {
  const t = useTranslations('auth')
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', password: '', locale: 'hi' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async () => {
    if (!form.name || !form.phone || !form.password) { setError('Please fill in all fields'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', form.name)
      router.push(`/${form.locale}/dashboard`)
    } catch { setError('Registration failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <>
      <Navbar locale={locale} />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="au1" style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
            <h1 className="syne" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>Create Account</h1>
            <p style={{ color: 'var(--muted)', fontSize: 15 }}>Start protecting your crops with AI</p>
          </div>

          <div className="au2 dark-card" style={{ padding: 36 }}>
            {error && (
              <div style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            {[
              { key: 'name', label: t('name'), type: 'text', placeholder: 'Ramesh Kumar' },
              { key: 'phone', label: t('phone'), type: 'tel', placeholder: '9999999999' },
              { key: 'password', label: t('password'), type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={(form as any)[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="dark-input"
                />
              </div>
            ))}

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Preferred Language
              </label>
              <select
                value={form.locale}
                onChange={e => setForm({ ...form, locale: e.target.value })}
                className="dark-input"
                style={{ cursor: 'pointer' }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} style={{ background: '#0D1A0F' }}>{l.label}</option>
                ))}
              </select>
            </div>

            <button onClick={handleRegister} disabled={loading} className="btn-primary" style={{ width: '100%', textAlign: 'center', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account...' : t('registerButton')}
            </button>
          </div>

          <div className="au3" style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              {t('alreadyHaveAccount')}{' '}
              <Link href={`/${locale}/login`} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                {t('loginButton')}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}