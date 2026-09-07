'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function PlatformSection() {
  const { t } = useTranslation()

  const features = [
    {
      title: t.platformPage.data,
      description: t.platformPage.dataDesc,
      icon: '📊',
      link: '/platform/data',
    },
    {
      title: t.platformPage.serviceManagement,
      description: t.platformPage.serviceManagementDesc,
      icon: '⚙️',
      link: '/platform/service',
    },
    {
      title: t.platformPage.compliance,
      description: t.platformPage.complianceDesc,
      icon: '✅',
      link: '/platform/compliance',
    },
    {
      title: t.platformPage.apiResources,
      description: t.platformPage.apiResourcesDesc,
      icon: '🔌',
      link: '/platform/api',
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.platformPage.title}</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {t.platformPage.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.link}
                className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all hover:border-primary group bg-white"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-700 mb-4">{feature.description}</p>
                <span className="text-primary font-semibold inline-flex items-center gap-2">
                  {t.platformPage.learnMore}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          <section className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">{t.platformPage.analyticsTitle}</h3>
                <p className="text-lg mb-6 text-primary-100">
                  {t.platformPage.analyticsDesc}
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t.platformPage.realTimeViz}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t.platformPage.customizableReports}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t.platformPage.exportCapabilities}
                  </li>
                </ul>
                <Link href="/platform/data" className="btn-secondary inline-block">
                  {t.platformPage.exploreAnalytics}
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 rounded-lg p-8 h-64 flex items-center justify-center">
                  <div className="text-6xl">📈</div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-3xl font-bold mb-8 text-center">{t.platformPage.capabilities}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl mb-4">🔒</div>
                <h4 className="text-xl font-bold mb-2">{t.platformPage.secureCompliant}</h4>
                <p className="text-gray-700">
                  {t.platformPage.secureCompliantDesc}
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-bold mb-2">{t.platformPage.fastReliable}</h4>
                <p className="text-gray-700">
                  {t.platformPage.fastReliableDesc}
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl mb-4">🔧</div>
                <h4 className="text-xl font-bold mb-2">{t.platformPage.easyIntegration}</h4>
                <p className="text-gray-700">
                  {t.platformPage.easyIntegrationDesc}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">{t.platformPage.readyToStart}</h3>
            <p className="text-lg text-gray-700 mb-6">
              {t.platformPage.readyToStartDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary inline-block">
                {t.platformPage.signUpNow}
              </Link>
              <Link href="/contact" className="btn-secondary inline-block">
                {t.platformPage.contactSales}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

