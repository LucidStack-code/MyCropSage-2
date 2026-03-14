import StoreMap from '@/components/StoreMap'
import Navbar from '@/components/Navbar'
import { getTranslations } from 'next-intl/server'

export default async function StoresPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'stores' })

  return (
    <>
      <Navbar locale={locale} />
      <main className="page" style={{ maxWidth: 900 }}>
        <div className="au1" style={{ marginBottom: 40 }}>
          <div className="eyebrow">Store Finder</div>
          <h1 className="syne page-title">{t('title')}</h1>
          <p className="page-subtitle">Find pesticides, seeds and fertilizers near you</p>
        </div>
        <StoreMap locale={locale} />
      </main>
    </>
  )
}