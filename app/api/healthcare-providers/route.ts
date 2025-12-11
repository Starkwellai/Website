import { NextResponse } from 'next/server'

// サンプルデータ - 実際の実装ではデータベースから取得
const sampleProviders = [
  {
    id: 1,
    name: 'Tokyo General Hospital',
    location: 'Tokyo',
    service: 'Colonoscopy',
    price: 50000,
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Metropolitan Medical Center',
    location: 'Tokyo',
    service: 'Colonoscopy',
    price: 45000,
    rating: 4.8,
  },
  {
    id: 3,
    name: 'City Health Clinic',
    location: 'Tokyo',
    service: 'Colonoscopy',
    price: 48000,
    rating: 4.2,
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const service = searchParams.get('service')
  const location = searchParams.get('location')

  // フィルタリング（実際の実装ではデータベースクエリを使用）
  let filteredProviders = sampleProviders

  if (service) {
    filteredProviders = filteredProviders.filter(p => 
      p.service.toLowerCase().includes(service.toLowerCase())
    )
  }

  if (location) {
    filteredProviders = filteredProviders.filter(p => 
      p.location.toLowerCase().includes(location.toLowerCase())
    )
  }

  // シミュレートされた遅延（実際のAPI呼び出しを模擬）
  await new Promise(resolve => setTimeout(resolve, 500))

  return NextResponse.json({
    providers: filteredProviders,
    count: filteredProviders.length,
  })
}

