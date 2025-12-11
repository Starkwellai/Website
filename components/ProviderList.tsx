'use client'

import useSWR from 'swr'

interface Provider {
  id: number
  name: string
  location: string
  service: string
  price: number
  rating: number
}

interface ProvidersResponse {
  providers: Provider[]
  count: number
}

interface ProviderListProps {
  service?: string
  location?: string
}

export default function ProviderList({ service, location }: ProviderListProps) {
  const params = new URLSearchParams()
  if (service) params.append('service', service)
  if (location) params.append('location', location)

  const { data, error, isLoading } = useSWR<ProvidersResponse>(
    `/api/healthcare-providers?${params.toString()}`,
    {
      revalidateOnFocus: false,
    }
  )

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading providers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-600">
        <p>Error loading providers. Please try again later.</p>
      </div>
    )
  }

  if (!data || data.providers.length === 0) {
    return (
      <div className="py-8 text-center text-gray-600">
        <p>No providers found. Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.providers.map((provider) => (
        <div key={provider.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-2">{provider.name}</h3>
          <p className="text-gray-600 mb-2">{provider.service}</p>
          <p className="text-gray-500 mb-4">{provider.location}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">¥{provider.price.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-gray-600">{provider.rating}</span>
              </div>
            </div>
            <button className="btn-primary text-sm px-4 py-2">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

