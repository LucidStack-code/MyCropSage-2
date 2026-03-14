'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🌐' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
]

interface NavbarProps {
  locale: string
  transparent?: boolean
}

export default function Navbar({ locale, transparent = false }: NavbarProps) {
  const t = useTranslations('navigation')
  const tAuth = useTranslations('auth')
  const pathname = usePathname()
  const router = useRouter()
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const currentLang = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0]

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setLangOpen(false)
  }

  const isActive = (path: string) => pathname.includes(path)

  const navLinks = [
    { href: `/${locale}/dashboard`, label: t('dashboard'), icon: '⬡' },
    { href: `/${locale}/detect`, label: t('detect'), icon: '🔬' },
    { href: `/${locale}/weather`, label: t('weather'), icon: '🌤️' },
    { href: `/${locale}/stores`, label: t('stores'), icon: '🏪' },
    { href: `/${locale}/history`, label: t('history'), icon: '📋' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 48px',
        height: 64,
        background: transparent ? 'rgba(10,15,10,0.6)' : 'rgba(10,15,10,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        {/* Logo */}
        <Link href={`/${locale}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🌿</span>
          <span className="syne grad-text2" style={{ fontSize: 18, fontWeight: 800 }}>MyCropSage</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              padding: '8px 14px', borderRadius: 10,
              fontSize: 13, fontWeight: 500,
              color: isActive(link.href.split('/').pop()!) ? 'var(--accent)' : 'var(--muted)',
              background: isActive(link.href.split('/').pop()!) ? 'rgba(0,255,135,0.08)' : 'transparent',
              textDecoration: 'none', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 13 }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>

          {/* Language switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 100, padding: '8px 16px',
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', color: 'var(--text)',
                fontSize: 13, fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.label}</span>
              <span style={{ opacity: 0.5, fontSize: 10 }}>▼</span>
            </button>

            {langOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#0D1A0F',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16, padding: 8,
                minWidth: 160,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                zIndex: 200,
              }}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => switchLocale(lang.code)}
                    style={{
                      width: '100%', padding: '10px 14px',
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: lang.code === locale ? 'rgba(0,255,135,0.08)' : 'transparent',
                      border: 'none', borderRadius: 10,
                      color: lang.code === locale ? 'var(--accent)' : 'var(--muted)',
                      fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {lang.code === locale && <span style={{ marginLeft: 'auto', fontSize: 11 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth buttons */}
          <Link href={`/${locale}/login`} style={{
            padding: '8px 18px', borderRadius: 100,
            fontSize: 13, fontWeight: 500,
            color: 'var(--muted)', textDecoration: 'none',
            transition: 'color 0.2s',
          }}>
            {tAuth('login')}
          </Link>
          <Link href={`/${locale}/register`} style={{
            background: 'var(--accent)', color: '#0A0F0A',
            padding: '9px 20px', borderRadius: 100,
            fontSize: 13, fontWeight: 700,
            textDecoration: 'none', transition: 'all 0.2s',
            letterSpacing: '0.02em',
          }}>
            {tAuth('registerButton')}
          </Link>
        </div>
      </nav>

      {/* Close dropdown on outside click */}
      {langOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => setLangOpen(false)}
        />
      )}
    </>
  )
}