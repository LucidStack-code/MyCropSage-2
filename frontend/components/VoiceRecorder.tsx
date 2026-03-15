'use client'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

interface VoiceRecorderProps {
  locale: string
  onResult: (advice: string, audioUrl?: string) => void
}

export default function VoiceRecorder({ locale, onResult }: VoiceRecorderProps) {
  const t = useTranslations('detect')
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  // Map locale to BCP 47 language code
  const LANG_CODES: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    te: 'te-IN',
    ta: 'ta-IN',
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        setSupported(false)
      }
    }
  }, [])

  const startListening = () => {
    setError('')
    setTranscript('')
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognition.lang = LANG_CODES[locale] || 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => setListening(true)

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('')
      setTranscript(text)
    }

    recognition.onend = async () => {
      setListening(false)
      if (transcript || recognitionRef.current?.lastTranscript) {
        const finalText = transcript || recognitionRef.current?.lastTranscript
        await processText(finalText)
      }
    }

    recognition.onerror = (e: any) => {
      setListening(false)
      if (e.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone in browser settings.')
      } else {
        setError(`Error: ${e.error}. Please try again.`)
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lastTranscript = transcript
      recognitionRef.current.stop()
    }
  }

  const processText = async (text: string) => {
    if (!text.trim()) return
    setProcessing(true)
    try {
      const analyzeRes = await fetch('/api/speech/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, locale }),
      })
      const data = await analyzeRes.json()

      // Get TTS audio
      const ttsRes = await fetch('/api/speech/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.advice, language: locale }),
      })
      const audioBuffer = await ttsRes.arrayBuffer()
      const audioUrl = URL.createObjectURL(
        new Blob([audioBuffer], { type: 'audio/mpeg' })
      )

      onResult(data.advice, audioUrl)
    } catch (err) {
      setError('Processing failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (!supported) {
    return (
      <div style={{ textAlign: 'center', padding: 24 }}>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Voice input is not supported in this browser.
          Please use Chrome or Edge.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>
          You can use the text input tab instead.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        .mic-btn { position: relative; }
        .mic-btn.listening::before,
        .mic-btn.listening::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid #00FF87;
          animation: ripple 1.5s ease-out infinite;
        }
        .mic-btn.listening::after { animation-delay: 0.75s; }
      `}</style>

      <button
        onClick={listening ? stopListening : startListening}
        disabled={processing}
        className={`mic-btn ${listening ? 'listening' : ''}`}
        style={{
          width: 88, height: 88, borderRadius: '50%',
          background: listening
            ? 'rgba(255,71,87,0.15)'
            : processing
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(0,255,135,0.1)',
          border: `2px solid ${listening ? '#FF4757' : processing ? 'var(--border)' : '#00FF87'}`,
          fontSize: 36, cursor: processing ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {processing ? '⏳' : listening ? '⏹' : '🎤'}
      </button>

      <p style={{ fontSize: 13, color: 'var(--muted)' }}>
        {listening
          ? `Listening in ${locale.toUpperCase()}... (click to stop)`
          : processing
          ? 'Processing your voice...'
          : `Click to speak in ${locale.toUpperCase()}`}
      </p>

      {transcript && (
        <div style={{
          background: 'rgba(0,255,135,0.06)',
          border: '1px solid rgba(0,255,135,0.2)',
          borderRadius: 12, padding: '12px 16px',
          width: '100%', textAlign: 'left',
        }}>
          <p style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Heard</p>
          <p style={{ fontSize: 14, color: 'var(--text)' }}>{transcript}</p>
        </div>
      )}

      {error && (
        <p style={{ fontSize: 13, color: 'var(--danger)', textAlign: 'center' }}>{error}</p>
      )}
    </div>
  )
}