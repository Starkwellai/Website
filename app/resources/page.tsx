'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function ResourcesPage() {
  const { t } = useTranslation()

  const resources = [
    {
      title: t.resourcesPage.understandingCosts,
      description: t.resourcesPage.understandingCostsDesc,
      category: t.resourcesPage.education,
      link: '#',
    },
    {
      title: t.resourcesPage.compareProviders,
      description: t.resourcesPage.compareProvidersDesc,
      category: t.resourcesPage.guide,
      link: '#',
    },
    {
      title: t.resourcesPage.insuranceBenefits,
      description: t.resourcesPage.insuranceBenefitsDesc,
      category: t.resourcesPage.insurance,
      link: '#',
    },
    {
      title: t.resourcesPage.preventiveCare,
      description: t.resourcesPage.preventiveCareDesc,
      category: t.resourcesPage.health,
      link: '#',
    },
    {
      title: t.resourcesPage.managingBills,
      description: t.resourcesPage.managingBillsDesc,
      category: t.resourcesPage.finance,
      link: '#',
    },
    {
      title: t.resourcesPage.qualityMetrics,
      description: t.resourcesPage.qualityMetricsDesc,
      category: t.resourcesPage.quality,
      link: '#',
    },
  ]

  const categories = [
    t.resourcesPage.all,
    t.resourcesPage.education,
    t.resourcesPage.guide,
    t.resourcesPage.insurance,
    t.resourcesPage.health,
    t.resourcesPage.finance,
    t.resourcesPage.quality,
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.resourcesPage.title}</h1>
          <p className="text-lg text-gray-700 mb-12">
            {t.resourcesPage.description}
          </p>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 rounded-full border border-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {resources.map((resource, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary bg-blue-50 px-3 py-1 rounded-full">
                    {resource.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                <p className="text-gray-700 mb-4">{resource.description}</p>
                <Link href={resource.link} className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
                  {t.resourcesPage.readMore}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          <section className="bg-gray-50 rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.resourcesPage.faq}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">{t.resourcesPage.faq1Question}</h3>
                <p className="text-gray-700">
                  {t.resourcesPage.faq1Answer}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{t.resourcesPage.faq2Question}</h3>
                <p className="text-gray-700">
                  {t.resourcesPage.faq2Answer}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{t.resourcesPage.faq3Question}</h3>
                <p className="text-gray-700">
                  {t.resourcesPage.faq3Answer}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{t.resourcesPage.needHelp}</h2>
            <p className="text-lg mb-6">
              {t.resourcesPage.needHelpDesc}
            </p>
            <Link href="/contact" className="btn-secondary inline-block">
              {t.resourcesPage.contactSupport}
            </Link>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}

