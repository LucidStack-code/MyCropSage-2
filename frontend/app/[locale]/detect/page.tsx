'use client'
import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import VoiceRecorder from '@/components/VoiceRecorder'

type Tab = 'image' | 'text' | 'voice'

export default function DetectPage() {
  const t = useTranslations('detect')
  const tResult = useTranslations('result')
  const params = useParams()
  const locale = params.locale as string
  const [activeTab, setActiveTab] = useState<Tab>('image')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [textInput, setTextInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [voiceAdvice, setVoiceAdvice] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setResult(null)
  }

  const handleImageAnalyze = async () => {
    if (!imageFile) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const { url } = await uploadRes.json()
      const detectRes = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/detect/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: url }),
      })
      const data = await detectRes.json()
      setResult({ ...data, imageUrl: url })
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleTextAnalyze = async () => {
    if (!textInput.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/speech/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput, locale }),
      })
      const data = await res.json()
      setResult({ textResult: data.advice })
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'image', icon: '📷', label: 'Upload Image' },
    { id: 'text', icon: '✏️', label: 'Describe Problem' },
    { id: 'voice', icon: '🎤', label: 'Voice Input' },
  ]

  return (
    <>
      <Navbar locale={locale} />
      <main className="page" style={{ maxWidth: 800 }}>
        <div className="au1" style={{ marginBottom: 40 }}>
          <div className="eyebrow">AI Detection</div>
          <h1 className="syne page-title">{t('title')}</h1>
          <p className="page-subtitle">Upload, describe, or speak about your crop issue</p>
        </div>

        {/* Tabs */}
        <div className="au2" style={{ display: 'flex', gap: 8, marginBottom: 32, background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 16, border: '1px solid var(--border)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setResult(null) }} style={{
              flex: 1, padding: '12px 16px', borderRadius: 12,
              border: 'none', cursor: 'pointer',
              background: activeTab === tab.id ? 'rgba(0,255,135,0.12)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
              fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Image Tab */}
        {activeTab === 'image' && (
          <div className="au3 dark-card" style={{ padding: 32 }}>
            <div onClick={() => fileInputRef.current?.click()} style={{
              border: `2px dashed ${imagePreview ? 'rgba(0,255,135,0.4)' : 'var(--border)'}`,
              borderRadius: 16, padding: '48px 32px', textAlign: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
              background: imagePreview ? 'rgba(0,255,135,0.03)' : 'transparent',
            }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ maxHeight: 200, margin: '0 auto', borderRadius: 12, display: 'block', objectFit: 'contain' }} />
              ) : (
                <>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
                  <p style={{ color: 'var(--muted)', fontSize: 14 }}>{t('uploadHint')}</p>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            {imageFile && (
              <button onClick={handleImageAnalyze} disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 20, textAlign: 'center', opacity: loading ? 0.7 : 1 }}>
                {loading ? <><span className="spinner" style={{ marginRight: 8 }} />{t('analyzing')}</> : t('analyzeButton')}
              </button>
            )}
          </div>
        )}

        {/* Text Tab */}
        {activeTab === 'text' && (
          <div className="au3 dark-card" style={{ padding: 32 }}>
            <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder={t('textPlaceholder')} rows={5} className="dark-input" style={{ resize: 'none', marginBottom: 20 }} />
            <button onClick={handleTextAnalyze} disabled={loading || !textInput.trim()} className="btn-primary" style={{ width: '100%', textAlign: 'center', opacity: loading || !textInput.trim() ? 0.6 : 1 }}>
              {loading ? t('analyzing') : t('analyzeButton')}
            </button>
          </div>
        )}

        {/* Voice Tab */}
        {activeTab === 'voice' && (
          <div className="au3 dark-card" style={{ padding: 48, textAlign: 'center' }}>
            <VoiceRecorder locale={locale} onResult={(advice, url) => { setVoiceAdvice(advice); if (url) setAudioUrl(url) }} />
            {voiceAdvice && (
              <div style={{ marginTop: 32, textAlign: 'left', background: 'rgba(0,255,135,0.06)', border: '1px solid rgba(0,255,135,0.2)', borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🌾 Farming Advice</p>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text)' }}>{voiceAdvice}</p>
                {audioUrl && <audio src={audioUrl} controls autoPlay style={{ width: '100%', marginTop: 16 }} />}
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="au4" style={{ marginTop: 24 }}>
            {result.textResult ? (
              <div className="dark-card" style={{ padding: 28 }}>
                <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🌾 Analysis Result</p>
                <p style={{ fontSize: 15, lineHeight: 1.7 }}>{result.textResult}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="dark-card" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{tResult('disease')}</p>
                      <p className="syne" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em' }}>
                        {result.disease_name?.split('___')[1]?.replace(/_/g, ' ') || result.disease_name}
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                        {result.disease_name?.split('___')[0]?.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 32, fontWeight: 800, color: result.confidence > 70 ? 'var(--accent)' : result.confidence > 40 ? 'var(--warning)' : 'var(--danger)' }} className="syne">
                        {result.confidence}%
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{tResult('confidence')}</div>
                    </div>
                  </div>
                  {/* Confidence bar */}
                  <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 100, height: 4 }}>
                    <div style={{ background: 'linear-gradient(90deg,var(--accent),var(--accent2))', height: '100%', borderRadius: 100, width: `${result.confidence}%`, transition: 'width 1s ease' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="dark-card" style={{ padding: 24, borderColor: 'rgba(0,255,135,0.15)' }}>
                    <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>💊 {tResult('treatment')}</p>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--muted)' }}>{result.treatment}</p>
                  </div>
                  <div className="dark-card" style={{ padding: 24, borderColor: 'rgba(0,212,255,0.15)' }}>
                    <p style={{ fontSize: 11, color: 'var(--accent2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>🛡️ {tResult('prevention')}</p>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--muted)' }}>{result.prevention}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  )
}