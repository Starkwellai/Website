'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function FeatureBlocks() {
  const { t } = useTranslation()

  const features = [
    {
      title: t.features.findCare,
      points: t.features.findCarePoints,
      image: '👨‍⚕️',
    },
    {
      title: t.features.compareDetails,
      points: t.features.compareDetailsPoints,
      image: '👨‍⚕️',
    },
    {
      title: t.features.estimateCosts,
      points: t.features.estimateCostsPoints,
      image: '💰',
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-6xl mb-6">{feature.image}</div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <ul className="space-y-3 text-left">
                {feature.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

