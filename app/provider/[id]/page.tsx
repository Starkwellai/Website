'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'

interface ProviderDetails {
  provider_id: number
  provider_name: string
  location: string
  rating: number
  service_name: string
  price: number
  distance?: number
  waitTime?: number
  inNetwork?: boolean
  acceptedPlans?: string[]
  costScore?: number
  convenienceScore?: number
  qualityScore?: number
  overallScore?: number
  address?: string
  phone?: string
  hours?: string
  description?: string
  specialties?: string[]
  website?: string
}

// Mock data - 実際の実装ではAPIから取得
const getProviderDetails = (id: string): ProviderDetails | null => {
  const providers: ProviderDetails[] = [
    {
      provider_id: 1,
      provider_name: 'Intermountain InstaCare – Sugar House',
      location: 'Salt Lake City, UT 84105',
      address: '1138 E 2100 S, Salt Lake City, UT 84105',
      phone: '(801) 442-2000',
      hours: 'Mon-Fri: 8:00 AM - 8:00 PM, Sat-Sun: 9:00 AM - 5:00 PM',
      rating: 4.6,
      service_name: 'Urgent Care',
      price: 30,
      distance: 3.2,
      waitTime: 15,
      inNetwork: true,
      acceptedPlans: ['selecthealth-value-plus', 'selecthealth-select-plus', 'regence-blue-options'],
      costScore: 9,
      convenienceScore: 8,
      qualityScore: 8,
      overallScore: 8.3,
      description: 'Intermountain InstaCare provides convenient, high-quality urgent care services. Our experienced medical team is ready to treat a wide range of non-life-threatening conditions.',
      specialties: ['Urgent Care', 'Primary Care', 'Pediatrics', 'Sports Medicine'],
      website: 'https://intermountainhealthcare.org',
    },
    {
      provider_id: 2,
      provider_name: 'University of Utah Health Community Clinic',
      location: 'Salt Lake City, UT 84108',
      address: '729 Arapeen Dr, Salt Lake City, UT 84108',
      phone: '(801) 581-2000',
      hours: 'Mon-Fri: 7:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM',
      rating: 4.7,
      service_name: 'Primary Care',
      price: 40,
      distance: 2.1,
      waitTime: 5,
      inNetwork: true,
      acceptedPlans: ['university-basic', 'university-plus', 'selecthealth-value-plus'],
      costScore: 8,
      convenienceScore: 9,
      qualityScore: 9,
      overallScore: 8.7,
      description: 'University of Utah Health Community Clinic offers comprehensive primary care services with a focus on preventive medicine and patient education.',
      specialties: ['Primary Care', 'Family Medicine', 'Internal Medicine', 'Preventive Care'],
      website: 'https://healthcare.utah.edu',
    },
    {
      provider_id: 3,
      provider_name: 'Foothill Family Clinic',
      location: 'Salt Lake City, UT 84109',
      address: '1320 E 2100 S, Salt Lake City, UT 84109',
      phone: '(801) 486-2000',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
      rating: 4.8,
      service_name: 'Primary Care',
      price: 50,
      distance: 4.5,
      waitTime: 20,
      inNetwork: true,
      acceptedPlans: ['regence-blue-preferred', 'molina-complete-care'],
      costScore: 7,
      convenienceScore: 7,
      qualityScore: 10,
      overallScore: 8.0,
      description: 'Foothill Family Clinic provides personalized family medicine services with a commitment to building long-term patient relationships.',
      specialties: ['Family Medicine', 'Primary Care', 'Pediatrics', 'Women\'s Health'],
      website: 'https://foothillfamilyclinic.com',
    },
    {
      provider_id: 4,
      provider_name: 'SelectHealth Medical Group',
      location: 'Salt Lake City, UT 84102',
      address: '36 S State St, Salt Lake City, UT 84102',
      phone: '(801) 442-2000',
      hours: 'Mon-Fri: 7:00 AM - 7:00 PM, Sat: 9:00 AM - 3:00 PM',
      rating: 4.5,
      service_name: 'Primary Care',
      price: 25,
      distance: 1.8,
      waitTime: 10,
      inNetwork: true,
      acceptedPlans: ['selecthealth-value-plus', 'selecthealth-select-plus', 'selecthealth-select-care'],
      costScore: 10,
      convenienceScore: 9,
      qualityScore: 8,
      overallScore: 9.0,
      description: 'SelectHealth Medical Group offers comprehensive healthcare services with a focus on preventive care and wellness programs.',
      specialties: ['Primary Care', 'Preventive Care', 'Chronic Disease Management', 'Health Screenings'],
      website: 'https://selecthealth.org',
    },
    {
      provider_id: 5,
      provider_name: 'Regence Urgent Care Center',
      location: 'Salt Lake City, UT 84103',
      address: '150 S 400 E, Salt Lake City, UT 84103',
      phone: '(801) 486-2000',
      hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
      rating: 4.4,
      service_name: 'Urgent Care',
      price: 45,
      distance: 2.5,
      waitTime: 12,
      inNetwork: true,
      acceptedPlans: ['regence-blue-options', 'regence-blue-preferred', 'regence-blue-traditional'],
      costScore: 8,
      convenienceScore: 8,
      qualityScore: 7,
      overallScore: 7.7,
      description: 'Regence Urgent Care Center provides convenient walk-in urgent care services for non-emergency medical needs.',
      specialties: ['Urgent Care', 'Minor Injuries', 'Illness Treatment', 'Lab Services'],
      website: 'https://regence.com',
    },
  ]

  const provider = providers.find(p => p.provider_id === parseInt(id))
  return provider || null
}

export default function ProviderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const [provider, setProvider] = useState<ProviderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const providerData = getProviderDetails(params.id as string)
      setProvider(providerData)
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!provider) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Provider Not Found</h1>
            <p className="text-gray-600 mb-6">The provider you are looking for does not exist.</p>
            <Link href="/search" className="btn-primary inline-block">
              Back to Search
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-700 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search Results
        </Link>

        {/* Provider Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{provider.provider_name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xl font-semibold">{provider.rating}</span>
                </div>
                {provider.inNetwork !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    provider.inNetwork
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {provider.inNetwork ? t.searchResults.inNetwork : t.searchResults.outOfNetwork}
                  </span>
                )}
              </div>
              {provider.description && (
                <p className="text-gray-600 leading-relaxed mb-4">{provider.description}</p>
              )}
            </div>
            <div className="md:min-w-[200px]">
              <div className="bg-primary-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">{t.searchResults.estimatedCost}</p>
                <p className="text-3xl font-bold text-primary">${provider.price}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Location & Contact */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Location & Contact</h2>
            <div className="space-y-4">
              {provider.address && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">{provider.address}</p>
                  </div>
                </div>
              )}
              {provider.phone && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a href={`tel:${provider.phone}`} className="text-primary hover:underline">{provider.phone}</a>
                  </div>
                </div>
              )}
              {provider.hours && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Hours</p>
                    <p className="text-gray-600">{provider.hours}</p>
                  </div>
                </div>
              )}
              {provider.distance && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">{t.searchResults.distance}</p>
                    <p className="text-gray-600">{provider.distance} km away</p>
                  </div>
                </div>
              )}
              {provider.website && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Website</p>
                    <a 
                      href={provider.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {provider.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Service Information</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Service</p>
                <p className="text-gray-600">{provider.service_name}</p>
              </div>
              {provider.waitTime !== undefined && (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">{t.searchResults.waitTime}</p>
                    <p className="text-gray-600">{provider.waitTime} minutes</p>
                  </div>
                </div>
              )}
              {provider.specialties && provider.specialties.length > 0 && (
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {provider.specialties.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scores */}
        {(provider.costScore || provider.convenienceScore || provider.qualityScore || provider.overallScore) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quality Scores</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {provider.costScore !== undefined && (
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.searchResults.costScore}</p>
                  <p className="text-2xl font-bold text-primary">{provider.costScore}/10</p>
                </div>
              )}
              {provider.convenienceScore !== undefined && (
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.searchResults.convenienceScore}</p>
                  <p className="text-2xl font-bold text-green-600">{provider.convenienceScore}/10</p>
                </div>
              )}
              {provider.qualityScore !== undefined && (
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.searchResults.qualityScore}</p>
                  <p className="text-2xl font-bold text-yellow-600">{provider.qualityScore}/10</p>
                </div>
              )}
              {provider.overallScore !== undefined && (
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">{t.searchResults.overallScore}</p>
                  <p className="text-2xl font-bold text-purple-600">{provider.overallScore}/10</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map */}
        {provider.address && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Location Map</h2>
            <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100">
              {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(provider.address)}`}
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600 mb-2">Map preview unavailable</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Google Maps
              </a>
            </div>
          </div>
        )}

        {/* Accepted Insurance Plans */}
        {provider.acceptedPlans && provider.acceptedPlans.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Accepted Insurance Plans</h2>
            <div className="flex flex-wrap gap-2">
              {provider.acceptedPlans.map((plan, index) => (
                <span key={index} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium">
                  {plan.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-300 transition-colors"
          >
            Back to Search Results
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
