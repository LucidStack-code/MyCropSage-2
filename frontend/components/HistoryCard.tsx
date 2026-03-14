'use client'
import { useTranslations } from 'next-intl'

interface Detection {
  id: string
  diseaseName: string
  confidence: number
  treatment: string
  imageUrl: string
  createdAt: string
  locale: string
}

export default function HistoryCard({ detection }: { detection: Detection }) {
  const t = useTranslations('history')

  const formatDisease = (name: string) => {
    const parts = name.split('___')
    const crop = parts[0]?.replace(/_/g, ' ') || ''
    const disease = parts[1]?.replace(/_/g, ' ') || name
    return { crop, disease }
  }

  const { crop, disease } = formatDisease(detection.diseaseName)
  const isHealthy = disease.toLowerCase().includes('healthy')
  const date = new Date(detection.createdAt).toLocaleDateString()

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-green-300 transition">
      <div className="flex gap-4">
        {/* Image */}
        {detection.imageUrl && (
          <img
            src={detection.imageUrl}
            alt={disease}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <p className="text-sm text-gray-500">{crop}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>

          <p className={`font-semibold truncate ${
            isHealthy ? 'text-green-600' : 'text-red-600'
          }`}>
            {isHealthy ? '✅' : '⚠️'} {disease}
          </p>

          {/* Confidence bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{t('confidence')}</span>
              <span>{detection.confidence}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  detection.confidence > 70
                    ? 'bg-green-500'
                    : detection.confidence > 40
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${detection.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}