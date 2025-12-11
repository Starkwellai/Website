'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function StakeholderSolutions() {
  const { t } = useTranslation()

  const stakeholders = [
    {
      title: t.stakeholders.forProviders,
      icon: '🏥',
      description: t.stakeholders.forProvidersDesc,
    },
    {
      title: t.stakeholders.forEmployers,
      icon: '💼',
      description: t.stakeholders.forEmployersDesc,
    },
    {
      title: t.stakeholders.forPayers,
      icon: '💳',
      description: t.stakeholders.forPayersDesc,
    },
    {
      title: t.stakeholders.forLifeSciences,
      icon: '🔬',
      description: t.stakeholders.forLifeSciencesDesc,
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stakeholders.map((stakeholder, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{stakeholder.icon}</div>
              <h3 className="text-xl font-bold mb-3">{stakeholder.title}</h3>
              <p className="text-gray-700">{stakeholder.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

