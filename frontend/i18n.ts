import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  return {
    locale: locale || 'hi',
    messages: (await import(`./messages/${locale || 'hi'}.json`)).default
  }
})