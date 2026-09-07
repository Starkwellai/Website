'use client'

import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'

interface SearchResult {
  provider_id: number
  provider_name: string
  location: string
  rating: number
  service_name: string
  price: number
  insuredPrice?: number
  cashPrice?: number
  distance?: number
  waitTime?: number
  inNetwork?: boolean
  acceptedPlans?: string[]
  costScore?: number
  convenienceScore?: number
  qualityScore?: number
  overallScore?: number
}

interface SearchResultsProps {
  results: SearchResult[]
}

export default function SearchResults({ results }: SearchResultsProps) {
  const { t } = useTranslation()

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No results found. Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <div
          key={result.provider_id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-1">{result.provider_name}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {result.location}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{result.rating}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-800 mb-2">{result.service_name}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {result.insuredPrice !== undefined || result.cashPrice !== undefined ? (
                    <div className="flex flex-col gap-1">
                      {(result.insuredPrice ?? result.price) !== undefined && (
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-primary text-lg">
                            ${result.insuredPrice ?? result.price}
                          </span>
                          <span className="text-xs">({t.searchResults.withInsurance})</span>
                        </span>
                      )}
                      {result.cashPrice !== undefined && (
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-gray-800 text-lg">${result.cashPrice}</span>
                          <span className="text-xs">({t.searchResults.selfPay})</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span className="font-semibold text-primary text-lg">${result.price}</span>
                      <span className="text-xs">({t.searchResults.estimatedCost})</span>
                    </span>
                  )}
                  {result.distance && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {result.distance} km ({t.searchResults.distance})
                    </span>
                  )}
                  {result.waitTime !== undefined && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {result.waitTime} min ({t.searchResults.waitTime})
                    </span>
                  )}
                  {result.inNetwork !== undefined && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      result.inNetwork
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.inNetwork ? t.searchResults.inNetwork : t.searchResults.outOfNetwork}
                    </span>
                  )}
                </div>
              </div>

              {/* Scores */}
              {(result.costScore || result.convenienceScore || result.qualityScore) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {result.costScore !== undefined && (
                    <div className="bg-primary-50 p-2 rounded">
                      <p className="text-xs text-gray-600">{t.searchResults.costScore}</p>
                      <p className="text-lg font-bold text-primary">{result.costScore}/10</p>
                    </div>
                  )}
                  {result.convenienceScore !== undefined && (
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-xs text-gray-600">{t.searchResults.convenienceScore}</p>
                      <p className="text-lg font-bold text-green-600">{result.convenienceScore}/10</p>
                    </div>
                  )}
                  {result.qualityScore !== undefined && (
                    <div className="bg-yellow-50 p-2 rounded">
                      <p className="text-xs text-gray-600">{t.searchResults.qualityScore}</p>
                      <p className="text-lg font-bold text-yellow-600">{result.qualityScore}/10</p>
                    </div>
                  )}
                  {result.overallScore !== undefined && (
                    <div className="bg-purple-50 p-2 rounded">
                      <p className="text-xs text-gray-600">{t.searchResults.overallScore}</p>
                      <p className="text-lg font-bold text-purple-600">{result.overallScore}/10</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 md:min-w-[150px]">
              <Link
                href={`/provider/${result.provider_id}`}
                className="btn-primary text-center"
              >
                {t.searchResults.viewDetails}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

