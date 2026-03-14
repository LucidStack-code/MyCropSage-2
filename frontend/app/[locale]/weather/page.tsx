import WeatherWidget from '@/components/WeatherWidget'
import Navbar from '@/components/Navbar'
import { getTranslations } from 'next-intl/server'

export default async function WeatherPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'weather' })

  return (
    <>
      <Navbar locale={locale} />
      <main className="page" style={{ maxWidth: 800 }}>
        <div className="au1" style={{ marginBottom: 40 }}>
          <div className="eyebrow">Weather Intelligence</div>
          <h1 className="syne page-title">{t('title')}</h1>
          <p className="page-subtitle">Real-time conditions with smart farming advice</p>
        </div>
        <WeatherWidget locale={locale} />
      </main>
    </>
  )
}