import { useTranslations } from 'next-intl'
import StoreMap from '@/components/StoreMap'

export default function StoresPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = useTranslations('stores')
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          🏪 {t('title')}
        </h1>
        <StoreMap locale={locale} />
      </div>
    </main>
  )
}