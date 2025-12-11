'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export default function SearchBar() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [insurance, setInsurance] = useState('')

  return (
    <div className="bg-white py-6 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-3 w-full">
            <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t.search.findCare}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700"
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 w-full md:w-auto">
            <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              placeholder={t.search.location}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent outline-none text-gray-700"
            />
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 w-full md:w-auto">
            <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              placeholder={t.search.insurance}
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              className="bg-transparent outline-none text-gray-700"
            />
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 w-full md:w-auto justify-center">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t.search.search}
          </button>
        </div>
      </div>
    </div>
  )
}

