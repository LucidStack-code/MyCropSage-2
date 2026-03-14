'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface WeatherData {
  city: string
  temperature: number
  feels_like: number
  humidity: number
  wind_speed: number
  condition: string
  description: string
  advice: string
  icon: string
}

const WEATHER_ICONS: Record<string, string> = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌤️',
}

export default function WeatherWidget({ locale }: { locale: string }) {
  const t = useTranslations('weather')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await fetchWeather(pos.coords.latitude, pos.coords.longitude)
        },
        async () => {
          // Fallback to Pune coordinates
          await fetchWeather(18.5204, 73.8567)
        }
      )
    } else {
      fetchWeather(18.5204, 73.8567)
    }
  }, [locale])

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/weather?lat=${lat}&lon=${lon}&locale=${locale}`
      )
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setWeather(data)
    } catch {
      setError(t('loading'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <p className="text-red-500">{error || 'Weather unavailable'}</p>
      </div>
    )
  }

  const icon = WEATHER_ICONS[weather.condition] || '🌤️'

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {t('current')} — {weather.city}
      </h2>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-6xl">{icon}</span>
        <div>
          <p className="text-5xl font-bold text-gray-800">
            {weather.temperature}°C
          </p>
          <p className="text-gray-500 capitalize">{weather.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-3 text-center">
          <p className="text-2xl">💧</p>
          <p className="text-sm text-gray-500">{t('humidity')}</p>
          <p className="font-semibold">{weather.humidity}%</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <p className="text-2xl">💨</p>
          <p className="text-sm text-gray-500">{t('wind')}</p>
          <p className="font-semibold">{weather.wind_speed} m/s</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <p className="text-2xl">🌡️</p>
          <p className="text-sm text-gray-500">Feels like</p>
          <p className="font-semibold">{weather.feels_like}°C</p>
        </div>
      </div>

      <div className="bg-green-100 border border-green-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-green-800 mb-1">
          🌾 {t('advice')}
        </p>
        <p className="text-green-700 text-sm">{weather.advice}</p>
      </div>
    </div>
  )
}