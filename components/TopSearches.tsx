'use client'

import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'

export default function TopSearches() {
  const { t } = useTranslation()

  const topSearches = [
    {
      rank: 1,
      title: t.utah.mri,
      description: t.utah.mriDesc,
      icon: '🔍',
    },
    {
      rank: 2,
      title: t.utah.urgentCare,
      description: t.utah.urgentCareDesc,
      icon: '🏥',
    },
    {
      rank: 3,
      title: t.utah.er,
      description: t.utah.erDesc,
      icon: '🚨',
    },
    {
      rank: 4,
      title: t.utah.labTest,
      description: t.utah.labTestDesc,
      icon: '🧪',
    },
    {
      rank: 5,
      title: t.utah.delivery,
      description: t.utah.deliveryDesc,
      icon: '👶',
    },
    {
      rank: 6,
      title: t.utah.orthopedic,
      description: t.utah.orthopedicDesc,
      icon: '🦴',
    },
    {
      rank: 7,
      title: t.utah.physicalTherapy,
      description: t.utah.physicalTherapyDesc,
      icon: '💪',
    },
    {
      rank: 8,
      title: t.utah.mentalHealth,
      description: t.utah.mentalHealthDesc,
      icon: '🧠',
    },
    {
      rank: 9,
      title: t.utah.pediatrics,
      description: t.utah.pediatricsDesc,
      icon: '👨‍⚕️',
    },
    {
      rank: 10,
      title: t.utah.dental,
      description: t.utah.dentalDesc,
      icon: '🦷',
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.utah.topSearches}
          </h2>
          <p className="text-lg text-gray-700">
            {t.utah.topSearchesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topSearches.map((item) => (
            <Link
              key={item.rank}
              href={`/search?service=${encodeURIComponent(item.title)}`}
              className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                    {item.rank}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-700 text-sm">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

