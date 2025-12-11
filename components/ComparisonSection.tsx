'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function ComparisonSection() {
  const { t } = useTranslation()

  // TOP 10 Most Searched Services in Utah
  const services = [
    { name: t.comparison.services.mri, icon: '🔍', rank: 1 },
    { name: t.comparison.services.urgentCare, icon: '🏥', rank: 2 },
    { name: t.comparison.services.er, icon: '🚨', rank: 3 },
    { name: t.comparison.services.labTest, icon: '🧪', rank: 4 },
    { name: t.comparison.services.delivery, icon: '👶', rank: 5 },
    { name: t.comparison.services.orthopedic, icon: '🦴', rank: 6 },
    { name: t.comparison.services.physicalTherapy, icon: '💪', rank: 7 },
    { name: t.comparison.services.mentalHealth, icon: '🧠', rank: 8 },
    { name: t.comparison.services.pediatrics, icon: '👨‍⚕️', rank: 9 },
    { name: t.comparison.services.dental, icon: '🦷', rank: 10 },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t.comparison.title}
            </h2>
            <p className="text-lg text-gray-700">
              {t.comparison.description}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-lg p-8 h-64 flex items-center justify-center">
              <div className="text-6xl">💊</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-6 text-center">{t.comparison.compareCosts}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {services.map((service, index) => (
              <Link
                key={index}
                href={`/search?service=${encodeURIComponent(service.name)}`}
                className="bg-gray-800 text-white rounded-lg p-6 hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{service.icon}</span>
                  <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                    #{service.rank}
                  </span>
                </div>
                <h4 className="font-semibold mb-4 text-sm leading-tight">{service.name}</h4>
                <div className="inline-flex items-center gap-2 text-primary-light group-hover:text-primary font-semibold text-sm">
                  {t.comparison.priceComparison}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

