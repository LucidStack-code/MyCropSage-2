import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing' })
  const tAuth = await getTranslations({ locale, namespace: 'auth' })
  const tNav = await getTranslations({ locale, namespace: 'navigation' })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');
        :root {
          --accent: #00FF87; --accent2: #00D4FF; --accent3: #7B2FFF;
          --text: #F0FFF4; --muted: rgba(240,255,244,0.55);
          --card: rgba(255,255,255,0.04); --border: rgba(255,255,255,0.08);
          --g1: #0A0F0A; --g2: #0D1A0F;
        }
        body {
          font-family: 'Inter', sans-serif !important;
          background: var(--g1) !important;
          color: var(--text) !important;
          overflow-x: hidden;
        }
        body::before {
          content: ''; position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(0,255,135,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(0,212,255,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(123,47,255,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        .syne { font-family: 'Syne', sans-serif !important; }
        .grad-text {
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 50%, var(--accent3) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .grad-text2 {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes phoneFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes floatL { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatR { 0%,100%{transform:translateY(0)} 50%{transform:translateY(12px)} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes pulseGlow {
          0%,100%{box-shadow:0 0 0 0 rgba(0,255,135,0.6)}
          50%{box-shadow:0 0 0 6px rgba(0,255,135,0)}
        }
        .au1{animation:fadeUp 0.6s ease both}
        .au2{animation:fadeUp 0.6s ease 0.1s both}
        .au3{animation:fadeUp 0.6s ease 0.2s both}
        .au4{animation:fadeUp 0.6s ease 0.3s both}
        .au5{animation:fadeUp 0.6s ease 0.4s both}
        .phone-anim{animation:phoneFloat 5s ease-in-out infinite}
        .pill-l{animation:floatL 4s ease-in-out infinite}
        .pill-r{animation:floatR 4s ease-in-out infinite 2s}
        .pulse-dot{animation:pulseGlow 2s infinite}
        .btn-glow:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(0,255,135,0.5)!important}
        .btn-outline:hover{border-color:rgba(255,255,255,0.3)!important;background:rgba(255,255,255,0.04)!important}
        .feat:hover{background:var(--g2)!important}
        .feat:hover .feat-bar{opacity:1!important}
        .lang-chip:hover{border-color:rgba(0,255,135,0.4)!important;color:var(--accent)!important;background:rgba(0,255,135,0.06)!important}
        .lcard:hover{border-color:rgba(0,255,135,0.3)!important;transform:translateY(-6px)!important}
        .stat-card:hover{background:rgba(0,255,135,0.03)!important}
        .nav-btn:hover{transform:translateY(-1px);box-shadow:0 0 24px rgba(0,255,135,0.4)!important}
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 56px',
        background: 'rgba(10,15,10,0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="syne grad-text2" style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ WebkitTextFillColor: 'initial' }}>🌿</span> MyCropSage
        </div>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          <Link href={`/${locale}/dashboard`} style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}>{tNav('dashboard')}</Link>
          <Link href={`/${locale}/detect`} style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}>{tNav('detect')}</Link>
          <Link href={`/${locale}/register`} className="nav-btn" style={{
            background: 'var(--accent)', color: '#0A0F0A',
            padding: '10px 24px', borderRadius: 100,
            fontSize: 13, fontWeight: 700, textDecoration: 'none',
            transition: 'all 0.2s', letterSpacing: '0.02em'
          }}>{tAuth('registerButton')}</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '140px 56px 80px', position: 'relative', zIndex: 1 }}>
        <div className="au1" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)',
          padding: '8px 18px', borderRadius: 100,
          fontSize: 12, fontWeight: 500, color: 'var(--accent)',
          letterSpacing: '0.05em', textTransform: 'uppercase',
          marginBottom: 32, width: 'fit-content'
        }}>
          <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          MIT-WPU Hackathon 2026 · AI Agriculture Platform
        </div>

        <h1 className="syne au2" style={{ fontSize: 'clamp(56px,8vw,110px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 32 }}>
          Empowering<br />
          <span className="grad-text">Every Farmer</span>
          <br />with AI
        </h1>

        <p className="au3" style={{ fontSize: 'clamp(16px,2vw,20px)', color: 'var(--muted)', maxWidth: 560, lineHeight: 1.7, marginBottom: 48, fontWeight: 300 }}>
          {t('description')}
        </p>

        <div className="au4" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href={`/${locale}/register`} className="btn-glow" style={{
            background: 'var(--accent)', color: '#0A0F0A',
            padding: '16px 36px', borderRadius: 100,
            fontSize: 15, fontWeight: 700, letterSpacing: '0.02em',
            textDecoration: 'none', transition: 'all 0.3s', display: 'inline-block'
          }}>{t('getStarted')} →</Link>
          <Link href={`/${locale}/login`} className="btn-outline" style={{
            background: 'transparent', color: 'var(--text)',
            padding: '16px 36px', borderRadius: 100,
            fontSize: 15, fontWeight: 500,
            border: '1px solid var(--border)',
            textDecoration: 'none', transition: 'all 0.3s', display: 'inline-block'
          }}>{tAuth('login')}</Link>
        </div>

        <div className="au5" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['🇮🇳 हिंदी', '🇮🇳 मराठी', '🇮🇳 తెలుగు', '🇮🇳 தமிழ்', '🌐 English'].map(lang => (
            <span key={lang} className="lang-chip" style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              padding: '8px 16px', borderRadius: 100,
              fontSize: 13, color: 'var(--muted)', transition: 'all 0.2s'
            }}>{lang}</span>
          ))}
        </div>
      </section>

      {/* TICKER */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0', overflow: 'hidden', position: 'relative', zIndex: 1, background: 'rgba(0,255,135,0.02)' }}>
        <div style={{ display: 'flex', gap: 64, animation: 'ticker 20s linear infinite', width: 'max-content' }}>
          {['AI Crop Disease Detection', 'Multilingual Voice Assistant', 'Real-time Weather Intelligence', 'Agro Store Finder', '38+ Disease Classes', '96% Accuracy',
            'AI Crop Disease Detection', 'Multilingual Voice Assistant', 'Real-time Weather Intelligence', 'Agro Store Finder', '38+ Disease Classes', '96% Accuracy'].map((item, i) => (
            <span key={i} className="syne" style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        {[
          { num: '38+', label: 'Crop Diseases Detected' },
          { num: '5', label: 'Indian Languages' },
          { num: '96%', label: 'Detection Accuracy' },
          { num: '<2s', label: 'Response Time' },
        ].map(s => (
          <div key={s.num} className="stat-card" style={{ background: 'var(--g1)', padding: '48px 32px', textAlign: 'center', transition: 'background 0.3s' }}>
            <div className="syne grad-text2" style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.02em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section style={{ padding: '120px 56px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Core Features</div>
        <h2 className="syne" style={{ fontSize: 'clamp(36px,4vw,56px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 72, maxWidth: 500 }}>
          Built for the fields of Bharat
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border)' }}>
          {[
            { icon: '🔬', title: 'AI Disease Detection', desc: 'Upload a crop photo. MobileNetV2 identifies 38 diseases with 96% accuracy in under 2 seconds.' },
            { icon: '🎤', title: 'Voice Assistant', desc: 'Speak in Hindi, Marathi, Telugu or Tamil. Whisper AI transcribes and responds with audio in your language.' },
            { icon: '🌤️', title: 'Weather Intelligence', desc: 'Real-time conditions with smart farming advice. Know exactly when to spray, irrigate, or harvest.' },
            { icon: '🗺️', title: 'Agro Store Finder', desc: 'Locate pesticides, seeds and fertilizers on a live map. Get directions to the nearest store instantly.' },
            { icon: '🌐', title: 'Truly Multilingual', desc: "Every button, label, error message and AI response in the farmer's language. Zero English barrier." },
            { icon: '📋', title: 'Detection History', desc: 'Track every past detection. Monitor trends, build a farm health record, and catch repeat issues early.' },
          ].map(f => (
            <div key={f.title} className="feat" style={{ background: 'var(--g1)', padding: '40px 32px', transition: 'background 0.3s', position: 'relative', overflow: 'hidden' }}>
              <div className="feat-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--accent),var(--accent2))', opacity: 0, transition: 'opacity 0.3s' }} />
              <div style={{ width: 48, height: 48, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 24, background: 'rgba(0,255,135,0.05)' }}>{f.icon}</div>
              <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' }}>{f.title}</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE */}
      <section style={{ padding: '120px 56px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Live Product</div>
          <h2 className="syne" style={{ fontSize: 'clamp(36px,4vw,52px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 24 }}>See it in action</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--muted)', marginBottom: 40 }}>
            A farmer photographs a diseased tomato leaf. In 2 seconds, MyCropSage identifies the disease, delivers treatment advice in their language, and shows the nearest agro store.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              'Image → Cloudinary CDN → FastAPI AI inference',
              'Disease identified with 87% confidence in 1.8 seconds',
              'Treatment translated and spoken aloud via gTTS',
              'Nearest agro stores shown with live directions',
              'Detection saved to history for future reference',
            ].map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: 'var(--muted)' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13, marginTop: 1, flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,255,135,0.12),transparent 70%)', filter: 'blur(20px)' }} />

          {/* Left pill */}
          <div className="pill-l" style={{ position: 'absolute', left: -80, top: 100, zIndex: 10, background: 'rgba(10,15,10,0.9)', border: '1px solid rgba(0,255,135,0.2)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontSize: 12 }}>
            <div style={{ fontSize: 10, color: 'rgba(0,255,135,0.6)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🎤 Voice Input</div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>माझ्या पिकाला रोग आहे</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>Marathi detected</div>
          </div>

          {/* Phone */}
          <div className="phone-anim" style={{ background: '#0D0D0D', borderRadius: 44, padding: 14, width: 290, margin: '0 auto', boxShadow: '0 60px 120px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.06)', position: 'relative', zIndex: 2 }}>
            <div style={{ width: 80, height: 6, background: '#1A1A1A', borderRadius: 100, margin: '0 auto 14px' }} />
            <div style={{ background: '#0F1A10', borderRadius: 32, overflow: 'hidden', height: 540 }}>
              <div style={{ background: 'linear-gradient(135deg,#0D2B14,#0A1F0B)', padding: '22px 20px 18px', borderBottom: '1px solid rgba(0,255,135,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div className="syne" style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>🌿 MyCropSage</div>
                  <div style={{ fontSize: 10, background: 'rgba(0,255,135,0.15)', color: 'var(--accent)', padding: '3px 8px', borderRadius: 100 }}>● Live</div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>फसल रोग पहचान · AI Analysis</div>
              </div>
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Disease Detected', val: 'Tomato Early Blight', tag: '⚠️ Fungal Infection', tagStyle: { background: 'rgba(255,170,0,0.15)', color: '#FFAA00' }, bar: true },
                  { label: 'उपचार / Treatment', val: 'तांबे आधारित कवकनाशी', tag: '✓ Audio Ready', tagStyle: { background: 'rgba(0,255,135,0.12)', color: 'var(--accent)' }, bar: false },
                ].map((c, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14 }}>
                    <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{c.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.val}</div>
                    <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 600, marginTop: 5, ...c.tagStyle }}>{c.tag}</div>
                    {c.bar && <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 100, height: 4, marginTop: 8 }}><div style={{ background: 'linear-gradient(90deg,var(--accent),var(--accent2))', height: '100%', borderRadius: 100, width: '87%' }} /></div>}
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[{ val: '32°C', label: 'Temperature' }, { val: '☀️', label: 'Good to spray' }].map(m => (
                    <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 10, textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{m.val}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 14 }}>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>📍 Nearest Store</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Krishi Seva Kendra</div>
                  <div style={{ fontSize: 10, color: 'rgba(0,255,135,0.7)', marginTop: 3 }}>Open · 1.2 km · Get Directions →</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right pill */}
          <div className="pill-r" style={{ position: 'absolute', right: -60, bottom: 120, zIndex: 10, background: 'rgba(10,15,10,0.9)', border: '1px solid rgba(0,255,135,0.2)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontSize: 12 }}>
            <div style={{ fontSize: 10, color: 'rgba(0,255,135,0.6)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>📊 Result</div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>Early Blight</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>Treatment sent via audio</div>
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section style={{ padding: '100px 56px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Multilingual Support</div>
        <h2 className="syne" style={{ fontSize: 'clamp(36px,4vw,56px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 56 }}>
          Built for <span className="grad-text2">Bharat</span>,<br />in every language
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
          {[
            { flag: '🇮🇳', native: 'हिंदी', en: 'Hindi' },
            { flag: '🇮🇳', native: 'मराठी', en: 'Marathi' },
            { flag: '🇮🇳', native: 'తెలుగు', en: 'Telugu' },
            { flag: '🇮🇳', native: 'தமிழ்', en: 'Tamil' },
            { flag: '🌐', native: 'English', en: 'English' },
          ].map(l => (
            <div key={l.en} className="lcard" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 20px', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{l.flag}</div>
              <div className="syne" style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{l.native}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.05em' }}>{l.en}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 56px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'linear-gradient(135deg,#0D2416,#071A1A,#130D26)',
          border: '1px solid rgba(0,255,135,0.15)',
          borderRadius: 32, padding: '80px 72px',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,255,135,0.08),transparent 60%)' }} />
          <div>
            <h2 className="syne" style={{ fontSize: 'clamp(32px,3vw,48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Ready to protect<br /><span className="grad-text2">your harvest?</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 12 }}>
              Join farmers across India using AI to grow smarter and detect faster.
            </p>
          </div>
          <Link href={`/${locale}/register`} style={{
            background: 'var(--accent)', color: '#0A0F0A',
            padding: '18px 40px', borderRadius: 100,
            fontSize: 16, fontWeight: 700, letterSpacing: '0.02em',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'all 0.3s', display: 'inline-block'
          }}>{t('getStarted')} →</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '36px 56px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div className="syne grad-text2" style={{ fontSize: 16, fontWeight: 800 }}>🌿 MyCropSage</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Built for MIT-WPU Hackathon 2026 · Empowering Indian Farmers with AI</div>
      </footer>
    </>
  )
}
