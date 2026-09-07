'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProviderList from '@/components/ProviderList'
import SearchResults from '@/components/SearchResults'
import { useTranslation } from '@/hooks/useTranslation'

export default function SearchContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [service, setService] = useState('')
  const [location, setLocation] = useState('84101') // Default to Salt Lake City ZIP
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'rating'>('price')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    const plan = searchParams.get('plan')
    const specialty = searchParams.get('specialty')
    const symptoms = searchParams.get('symptoms')
    const zip = searchParams.get('zip')
    
    if (plan) setSelectedPlan(plan)
    if (specialty) setService(specialty === 'primary' ? 'Primary Care' : specialty === 'urgent' ? 'Urgent Care' : specialty)
    if (zip) setLocation(zip)
  }, [searchParams])

  // Mock search results with scoring (in real app, this would come from API)
  // Results are filtered by insurance plan to show only in-network clinics
  const getMockResults = () => {
    const baseResults = [
      {
        provider_id: 1,
        provider_name: 'Intermountain InstaCare – Sugar House',
        location: 'Salt Lake City, UT 84105',
        rating: 4.6,
        service_name: service || 'Urgent Care',
        price: 30,
        insuredPrice: 30,
        cashPrice: 85,
        distance: 3.2,
        waitTime: 15,
        inNetwork: true,
        acceptedPlans: ['selecthealth-value-plus', 'selecthealth-select-plus', 'regence-blue-options'],
        costScore: 9,
        convenienceScore: 8,
        qualityScore: 8,
        overallScore: 8.3,
      },
      {
        provider_id: 2,
        provider_name: 'University of Utah Health Community Clinic',
        location: 'Salt Lake City, UT 84108',
        rating: 4.7,
        service_name: service || 'Primary Care',
        price: 40,
        insuredPrice: 40,
        cashPrice: 110,
        distance: 2.1,
        waitTime: 5,
        inNetwork: true,
        acceptedPlans: ['university-basic', 'university-plus', 'selecthealth-value-plus'],
        costScore: 8,
        convenienceScore: 9,
        qualityScore: 9,
        overallScore: 8.7,
      },
      {
        provider_id: 3,
        provider_name: 'Foothill Family Clinic',
        location: 'Salt Lake City, UT 84109',
        rating: 4.8,
        service_name: service || 'Primary Care',
        price: 50,
        insuredPrice: 50,
        cashPrice: 125,
        distance: 4.5,
        waitTime: 20,
        inNetwork: true,
        acceptedPlans: ['regence-blue-preferred', 'molina-complete-care'],
        costScore: 7,
        convenienceScore: 7,
        qualityScore: 10,
        overallScore: 8.0,
      },
      {
        provider_id: 4,
        provider_name: 'SelectHealth Medical Group',
        location: 'Salt Lake City, UT 84102',
        rating: 4.5,
        service_name: service || 'Primary Care',
        price: 25,
        insuredPrice: 25,
        cashPrice: 95,
        distance: 1.8,
        waitTime: 10,
        inNetwork: true,
        acceptedPlans: ['selecthealth-value-plus', 'selecthealth-select-plus', 'selecthealth-select-care'],
        costScore: 10,
        convenienceScore: 9,
        qualityScore: 8,
        overallScore: 9.0,
      },
      {
        provider_id: 5,
        provider_name: 'Regence Urgent Care Center',
        location: 'Salt Lake City, UT 84103',
        rating: 4.4,
        service_name: service || 'Urgent Care',
        price: 45,
        insuredPrice: 45,
        cashPrice: 120,
        distance: 2.5,
        waitTime: 12,
        inNetwork: true,
        acceptedPlans: ['regence-blue-options', 'regence-blue-preferred', 'regence-blue-traditional'],
        costScore: 8,
        convenienceScore: 8,
        qualityScore: 7,
        overallScore: 7.7,
      },
    ]

    // Filter by selected insurance plan if provided
    if (selectedPlan) {
      return baseResults.filter(result => 
        result.acceptedPlans.includes(selectedPlan)
      )
    }

    return baseResults
  }

  const mockResults = getMockResults()

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          {selectedPlan ? t.utah.inNetworkClinics : 'AI Healthcare Provider Search'}
        </h1>
        
        {selectedPlan && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>{t.utah.inNetworkClinics}:</strong> {t.utah.findClinics}
            </p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Service / Specialty</label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g., Urgent Care, Primary Care, OBGYN"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">ZIP Code or City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., 84101 (Salt Lake City)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold">Sort by:</label>
            <button
              onClick={() => setSortBy('price')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'price' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {t.searchResults.cheapest}
            </button>
            <button
              onClick={() => setSortBy('distance')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'distance' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {t.searchResults.closest}
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'rating' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {t.searchResults.highestRated}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <SearchResults results={mockResults} />
        </div>

        {/* Fallback to ProviderList for API-based results */}
        {service && location && (
          <div className="mt-8">
            <ProviderList service={service} location={location} />
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

