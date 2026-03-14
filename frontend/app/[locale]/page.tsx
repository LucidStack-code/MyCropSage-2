import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function HomePage() {
  const t = useTranslations('landing')
  const tAuth = useTranslations('auth')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-b from-green-50 to-white">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-green-700 mb-4">
          🌿 {t('title')}
        </h1>
        <p className="text-2xl text-green-600 mb-4">
          {t('subtitle')}
        </p>
        <p className="text-gray-600 text-lg mb-8">
          {t('description')}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            {t('getStarted')}
          </Link>
          <Link
            href="/login"
            className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition font-medium"
          >
            {tAuth('login')}
          </Link>
        </div>
      </div>
    </main>
  )
}