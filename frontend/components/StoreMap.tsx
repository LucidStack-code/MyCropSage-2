'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

// Leaflet must be dynamically imported — it uses window object
const MapComponent = dynamic(() => import('./MapInner'), { ssr: false })

interface Store {
  id: string
  name: string
  address: string
  lat: number
  lon: number
  phone: string | null
  open_now: boolean | null
}

export default function StoreMap({ locale }: { locale: string }) {
  const t = useTranslations('stores')
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState({
    lat: 18.5204,
    lng: 73.8567
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserLocation(loc)
          await fetchStores(loc.lat, loc.lng)
        },
        async () => { await fetchStores(18.5204, 73.8567) }
      )
    } else {
      fetchStores(18.5204, 73.8567)
    }
  }, [])

  const fetchStores = async (lat: number, lon: number) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/stores?lat=${lat}&lon=${lon}`)
      const data = await res.json()
      setStores(data.stores || [])
    } catch {
      console.error('Failed to fetch stores')
    } finally {
      setLoading(false)
    }
  }

  const openDirections = (store: Store) => {
    window.open(
      `https://www.openstreetmap.org/directions?from=${userLocation.lat},${userLocation.lng}&to=${store.lat},${store.lon}`,
      '_blank'
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <p className="text-gray-500 animate-pulse">{t('finding')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Map */}
      <div style={{ height: '400px' }}>
        <MapComponent
          userLocation={userLocation}
          stores={stores}
        />
      </div>

      {/* Store list */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-700 mb-3">
          {t('title')} ({stores.length})
        </h3>
        {stores.length === 0 ? (
          <p className="text-gray-500">{t('noStores')}</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stores.map((store) => (
              <div
                key={store.id}
                className="border border-gray-200 rounded-xl p-3 hover:border-green-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{store.name}</p>
                    <p className="text-sm text-gray-500">{store.address}</p>
                    {store.phone && (
                      <p className="text-sm text-green-600">📞 {store.phone}</p>
                    )}
                  </div>
                  <button
                    onClick={() => openDirections(store)}
                    className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-700 transition ml-2 whitespace-nowrap"
                  >
                    {t('directions')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}