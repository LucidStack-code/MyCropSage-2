import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get('lat') || '18.5204'
    const lon = searchParams.get('lon') || '73.8567'
    const radius = searchParams.get('radius') || '5000'

    // Overpass API — completely free, no API key needed
    const query = `
      [out:json][timeout:25];
      (
        node["shop"="agrarian"](around:${radius},${lat},${lon});
        node["shop"="garden_centre"](around:${radius},${lat},${lon});
        node["name"~"krishi|agro|seeds|fertilizer|pesticide",i](around:${radius},${lat},${lon});
      );
      out body;
    `

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    })

    if (!res.ok) throw new Error('Overpass API failed')

    const data = await res.json()

    const stores = (data.elements || []).slice(0, 15).map((el: any) => ({
      id: el.id.toString(),
      name: el.tags?.name || 'Agro Store',
      address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || 'Address not available',
      lat: el.lat,
      lon: el.lon,
      phone: el.tags?.phone || null,
      open_now: null,
    }))

    return NextResponse.json({ stores })
  } catch (error) {
    console.error('Stores error:', error)
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
  }
}