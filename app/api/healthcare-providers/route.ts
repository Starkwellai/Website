import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface ProviderRecord {
  id: number
  name: string
  location: {
    address: string
    city: string
    state: string
    zip: string
    latitude?: number
    longitude?: number
  }
  rating: number
  inNetwork?: boolean
  acceptedPlans?: string[]
  services: Array<{
    codeType: 'CPT' | 'HCPCS' | 'OTHER'
    code: string
    name: string
  }>
  prices: {
    insuredPrice?: number
    cashPrice?: number
    currency?: string
  }
  waitTimeMin?: number
}

interface ProviderResponseItem {
  id: number
  name: string
  location: string
  service: string
  price: number
  insuredPrice?: number
  cashPrice?: number
  rating: number
}

const scrapedPath = path.join(process.cwd(), 'data', 'utah-providers.scraped.json')
const fallbackPath = path.join(process.cwd(), 'data', 'utah-providers.json')

const sampleProviders: ProviderRecord[] = fs.existsSync(scrapedPath)
  ? JSON.parse(fs.readFileSync(scrapedPath, 'utf8'))
  : JSON.parse(fs.readFileSync(fallbackPath, 'utf8'))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const service = searchParams.get('service')
  const location = searchParams.get('location')

  // フィルタリング（実際の実装ではデータベースクエリを使用）
  let filteredProviders = sampleProviders

  if (service) {
    filteredProviders = filteredProviders.filter(p => {
      const normalized = service.toLowerCase()
      return p.services.some(svc =>
        svc.name.toLowerCase().includes(normalized) ||
        svc.code.toLowerCase().includes(normalized)
      )
    })
  }

  if (location) {
    const normalized = location.toLowerCase()
    filteredProviders = filteredProviders.filter(p =>
      p.location.city.toLowerCase().includes(normalized) ||
      p.location.zip.toLowerCase().includes(normalized) ||
      p.location.address.toLowerCase().includes(normalized)
    )
  }

  // シミュレートされた遅延（実際のAPI呼び出しを模擬）
  await new Promise(resolve => setTimeout(resolve, 500))

  const responseProviders: ProviderResponseItem[] = filteredProviders.map(provider => {
    const primaryService = provider.services[0]
    const insuredPrice = provider.prices?.insuredPrice
    const cashPrice = provider.prices?.cashPrice
    const price = insuredPrice ?? cashPrice ?? 0

    return {
      id: provider.id,
      name: provider.name,
      location: `${provider.location.city}, ${provider.location.state} ${provider.location.zip}`,
      service: primaryService?.name || 'General Care',
      price,
      insuredPrice,
      cashPrice,
      rating: provider.rating,
    }
  })

  return NextResponse.json({
    providers: responseProviders,
    count: responseProviders.length,
  })
}

