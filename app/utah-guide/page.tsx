'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TopSearches from '@/components/TopSearches'
import UtahSummary from '@/components/UtahSummary'
import { useTranslation } from '@/hooks/useTranslation'

export default function UtahGuidePage() {
  const { t } = useTranslation()

  const insurers = [
    {
      name: t.utah.selectHealth,
      description: t.utah.selectHealthDesc,
    },
    {
      name: t.utah.regence,
      description: t.utah.regenceDesc,
    },
    {
      name: t.utah.universityUtah,
      description: t.utah.universityUtahDesc,
    },
    {
      name: t.utah.molina,
      description: t.utah.molinaDesc,
    },
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.utah.title}</h1>
          <p className="text-xl text-gray-700 mb-12">{t.utah.subtitle}</p>

          {/* Medicaid Expansion */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.utah.medicaidExpansion}</h2>
            <p className="text-lg text-gray-700 mb-6">
              {t.utah.medicaidExpansionDesc}
            </p>
          </section>

          {/* Major Insurers */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.utah.majorInsurers}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insurers.map((insurer, index) => (
                <div key={index} className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-bold text-primary mb-2">{insurer.name}</h3>
                  <p className="text-gray-700 text-sm">{insurer.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Characteristics */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.utah.pricingCharacteristics}</h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-bold mb-2 text-green-800">{t.utah.urgentCarePrice}</h3>
                <p className="text-gray-700">{t.utah.urgentCarePriceDesc}</p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="text-xl font-bold mb-2 text-red-800">{t.utah.erPrice}</h3>
                <p className="text-gray-700">{t.utah.erPriceDesc}</p>
              </div>
            </div>
          </section>

          {/* Recommended Approach */}
          <section className="mb-12 bg-primary text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">{t.utah.recommendedApproach}</h2>
            <p className="text-lg mb-6">{t.utah.recommendedApproachDesc}</p>
            <div className="flex items-center gap-4 text-2xl">
              <span className="bg-white text-primary px-4 py-2 rounded">1. {t.utah.primaryCare}</span>
              <span>→</span>
              <span className="bg-white text-primary px-4 py-2 rounded">2. {t.utah.urgentCare}</span>
              <span>→</span>
              <span className="bg-white text-primary px-4 py-2 rounded">3. {t.utah.er}</span>
            </div>
          </section>

          {/* In-Network */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.utah.inNetwork}</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-lg text-gray-700">{t.utah.inNetworkDesc}</p>
            </div>
          </section>
        </div>
      </div>
      
      {/* Top Searches Section */}
      <TopSearches />
      
      {/* Summary Section */}
      <UtahSummary />
      
      <Footer />
    </main>
  )
}

