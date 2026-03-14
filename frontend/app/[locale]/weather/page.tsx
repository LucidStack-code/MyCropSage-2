import { useTranslations } from 'next-intl'
import WeatherWidget from '@/components/WeatherWidget'

export default function WeatherPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = useTranslations('weather')
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          🌤️ {t('title')}
        </h1>
        <WeatherWidget locale={locale} />
      </div>
    </main>
  )
}