'use client'
import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import VoiceRecorder from '@/components/VoiceRecorder'

type Tab = 'image' | 'text' | 'voice'

export default function DetectPage() {
  const t = useTranslations('detect')
  const tResult = useTranslations('result')
  const params = useParams()
  const locale = params.locale as string

  const [activeTab, setActiveTab] = useState<Tab>('image')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [textInput, setTextInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [voiceAdvice, setVoiceAdvice] = useState('')
  const [audioUrl, setAudioUrl] = useState<string>('')
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
      // Upload to Cloudinary via API route
      const formData = new FormData()
      formData.append('file', imageFile)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const { url } = await uploadRes.json()

      // Send URL to FastAPI
      const detectRes = await fetch(
        `${process.env.NEXT_PUBLIC_FASTAPI_URL}/detect/image`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: url }),
        }
      )
      const data = await detectRes.json()
      setResult({ ...data, imageUrl: url })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
      setResult({ textResult: data.advice, englishText: data.english_text })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceResult = (advice: string, url?: string) => {
    setVoiceAdvice(advice)
    if (url) setAudioUrl(url)
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'image', label: t('uploadLabel'), icon: '📷' },
    { id: 'text', label: t('textLabel'), icon: '✏️' },
    { id: 'voice', label: t('voiceLabel'), icon: '🎤' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          🔬 {t('title')}
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null) }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Image Tab */}
        {activeTab === 'image' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg object-contain"
                />
              ) : (
                <>
                  <p className="text-4xl mb-2">📷</p>
                  <p className="text-gray-500">{t('uploadHint')}</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imageFile && (
              <button
                onClick={handleImageAnalyze}
                disabled={loading}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? t('analyzing') : t('analyzeButton')}
              </button>
            )}
          </div>
        )}

        {/* Text Tab */}
        {activeTab === 'text' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t('textPlaceholder')}
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:border-green-400 resize-none"
            />
            <button
              onClick={handleTextAnalyze}
              disabled={loading || !textInput.trim()}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? t('analyzing') : t('analyzeButton')}
            </button>
          </div>
        )}

        {/* Voice Tab */}
        {activeTab === 'voice' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <VoiceRecorder locale={locale} onResult={handleVoiceResult} />
            {voiceAdvice && (
              <div className="mt-6 text-left bg-green-50 rounded-xl p-4">
                <p className="font-semibold text-green-800 mb-2">
                  🌾 {tResult('treatment')}
                </p>
                <p className="text-green-700">{voiceAdvice}</p>
                {audioUrl && (
                  <audio
                    src={audioUrl}
                    controls
                    autoPlay
                    className="w-full mt-3"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
            {result.textResult ? (
              <>
                <h2 className="text-lg font-semibold text-green-700 mb-3">
                  🌾 {tResult('treatment')}
                </h2>
                <p className="text-gray-700">{result.textResult}</p>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-green-700">
                    {tResult('disease')}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.confidence > 70
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {result.confidence}% {tResult('confidence')}
                  </span>
                </div>

                <p className="text-xl font-bold text-gray-800 mb-4">
                  {result.disease_name?.split('___')[1]?.replace(/_/g, ' ') || result.disease_name}
                </p>

                <div className="bg-green-50 rounded-xl p-4 mb-3">
                  <p className="font-semibold text-green-800 mb-1">
                    💊 {tResult('treatment')}
                  </p>
                  <p className="text-green-700 text-sm">{result.treatment}</p>
                </div>

                {result.prevention && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="font-semibold text-blue-800 mb-1">
                      🛡️ {tResult('prevention')}
                    </p>
                    <p className="text-blue-700 text-sm">{result.prevention}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}