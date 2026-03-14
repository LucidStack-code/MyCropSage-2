'use client'
import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'

interface VoiceRecorderProps {
  locale: string
  onResult: (advice: string, audioUrl?: string) => void
}

export default function VoiceRecorder({ locale, onResult }: VoiceRecorderProps) {
  const t = useTranslations('detect')
  const [recording, setRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  const startRecording = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await processAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setRecording(true)
    } catch {
      setError('Microphone access denied. Please allow microphone access.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
      setProcessing(true)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Step 1: Transcribe audio via FastAPI Whisper
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const transcribeRes = await fetch(
        `${process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'}/speech/transcribe`,
        { method: 'POST', body: formData }
      )
      const { text, language } = await transcribeRes.json()

      // Step 2: Analyze text
      const analyzeRes = await fetch('/api/speech/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, locale }),
      })
      const { advice } = await analyzeRes.json()

      // Step 3: Get TTS audio
      const ttsRes = await fetch('/api/speech/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: advice, language: locale }),
      })
      const audioBuffer = await ttsRes.arrayBuffer()
      const audioUrl = URL.createObjectURL(
        new Blob([audioBuffer], { type: 'audio/mpeg' })
      )

      onResult(advice, audioUrl)
    } catch (err) {
      setError('Processing failed. Please try again.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={recording ? stopRecording : startRecording}
        disabled={processing}
        className={`w-20 h-20 rounded-full text-white text-3xl transition-all shadow-lg ${
          recording
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {recording ? '⏹' : processing ? '⏳' : '🎤'}
      </button>

      <p className="text-sm text-gray-500">
        {recording
          ? t('voiceStop') + ' — recording...'
          : processing
          ? 'Processing...'
          : t('voiceStart')}
      </p>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  )
}
