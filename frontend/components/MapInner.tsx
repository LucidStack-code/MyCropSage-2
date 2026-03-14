'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons in Next.js
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const storeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

interface Props {
  userLocation: { lat: number; lng: number }
  stores: Array<{
    id: string
    name: string
    address: string
    lat: number
    lon: number
  }>
}

export default function MapInner({ userLocation, stores }: Props) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>Your location</Popup>
      </Marker>

      {/* Store markers */}
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={[store.lat, store.lon]}
          icon={storeIcon}
        >
          <Popup>
            <strong>{store.name}</strong><br />
            {store.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
