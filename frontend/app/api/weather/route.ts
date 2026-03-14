import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get('lat') || '18.5204'
    const lon = searchParams.get('lon') || '73.8567'
    const radius = searchParams.get('radius') || '5000'

    const apiKey = process.env.OPENWEATHER_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Weather API key not configured' },
        { status: 500 }
      )
    }

    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${lat},${lon}&radius=${radius}&keyword=agricultural+store+krishi+seva+kendra&key=${apiKey}`
    )

    if (!placesRes.ok) {
      throw new Error('Places API failed')
    }

    const data = await placesRes.json()

    const stores = (data.results || []).slice(0, 10).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lon: place.geometry.location.lng,
      rating: place.rating || null,
      open_now: place.opening_hours?.open_now ?? null,
    }))

    return NextResponse.json({ stores })
  } catch (error) {
    console.error('Stores error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    )
  }
}