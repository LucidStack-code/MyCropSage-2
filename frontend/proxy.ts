import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['en', 'hi', 'mr', 'te', 'ta'],
  defaultLocale: 'hi',
  localeDetection: true,
  localePrefix: 'always'
})

export default function middleware(request: NextRequest) {
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(en|hi|mr|te|ta)/:path*', '/((?!api|_next|.*\\..*).*)']
}