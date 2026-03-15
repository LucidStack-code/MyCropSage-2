import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import '../globals.css'
import '../global-dark.css'
import SplashScreen from '@/components/SplashScreen'
import PageTransition from '@/components/PageTransition'
import NextTopLoader from 'nextjs-toploader'

const locales = ['en', 'hi', 'mr', 'te', 'ta']

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <NextTopLoader
            color="00FF87"
            initialPosition={0.80}
            crawlSpeed={200}
            height={2}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #00FF87, 0 0 5px #00FF87"
          />

          <SplashScreen>
            <PageTransition>
              {children}
            </PageTransition>
          </SplashScreen>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}