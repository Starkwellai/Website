'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'

export default function AIFeaturesPage() {
  const { t } = useTranslation()

  const features = [
    {
      title: t.aiFeatures.insuranceCardScan,
      description: t.aiFeatures.insuranceCardScanDesc,
      icon: '📸',
    },
    {
      title: t.aiFeatures.costSimulation,
      description: t.aiFeatures.costSimulationDesc,
      icon: '💰',
    },
    {
      title: t.aiFeatures.clinicOptimization,
      description: t.aiFeatures.clinicOptimizationDesc,
      icon: '🎯',
    },
    {
      title: t.aiFeatures.triage,
      description: t.aiFeatures.triageDesc,
      icon: '🏥',
    },
    {
      title: t.aiFeatures.chatConcierge,
      description: t.aiFeatures.chatConciergeDesc,
      icon: '💬',
    },
    {
      title: t.aiFeatures.costReport,
      description: t.aiFeatures.costReportDesc,
      icon: '📊',
    },
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.aiFeatures.title}</h1>
            <p className="text-xl text-gray-700">
              {t.aiFeatures.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Example Use Case */}
          <section className="mt-16 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-6">{t.aiFeatures.exampleTriage}</h2>
            <div className="space-y-4 text-lg">
              <div className="bg-white/10 p-4 rounded-lg">
                <p className="font-semibold">{t.aiFeatures.exampleUser}</p>
                <p className="mt-2">{t.aiFeatures.exampleAiRecommendation}</p>
                <ul className="list-disc list-inside mt-2 space-y-2">
                  <li>{t.aiFeatures.examplePrimaryCare}</li>
                  <li>{t.aiFeatures.exampleUrgentCare}</li>
                  <li>{t.aiFeatures.exampleEr}</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}

