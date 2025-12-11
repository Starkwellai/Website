'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'

export default function PricingPage() {
  const { t } = useTranslation()

  const plans = [
    {
      category: 'consumers',
      title: t.pricing.forConsumers,
      items: [
        {
          name: t.pricing.free,
          price: t.pricing.freePrice,
          period: '',
          popular: false,
          features: [
            t.pricing.freeFeatures.basicSimulator,
            t.pricing.freeFeatures.costSearch,
            t.pricing.freeFeatures.estimate,
            t.pricing.freeFeatures.taxDeduction,
            t.pricing.freeFeatures.searchHistory,
          ],
        },
        {
          name: t.pricing.premium,
          price: t.pricing.premiumPrice,
          period: t.pricing.premiumYearly,
          popular: true,
          features: [
            t.pricing.premiumFeatures.allFree,
            t.pricing.premiumFeatures.highAccuracy,
            t.pricing.premiumFeatures.comparison,
            t.pricing.premiumFeatures.highCost,
            t.pricing.premiumFeatures.expenseManagement,
            t.pricing.premiumFeatures.unlimitedHistory,
            t.pricing.premiumFeatures.pdfReport,
            t.pricing.premiumFeatures.aiAdvice,
            t.pricing.premiumFeatures.prioritySupport,
          ],
        },
      ],
    },
    {
      category: 'providers',
      title: t.pricing.forHealthcareProviders,
      items: [
        {
          name: t.pricing.individualProvider,
          price: t.pricing.individualProviderPrice,
          period: '',
          popular: false,
          features: [
            t.pricing.individualProviderFeatures.explanationSheet,
            t.pricing.individualProviderFeatures.comparisonTable,
            t.pricing.individualProviderFeatures.simulation,
            t.pricing.individualProviderFeatures.pdfOutput,
            t.pricing.individualProviderFeatures.unlimitedCases,
          ],
        },
        {
          name: t.pricing.clinic,
          price: t.pricing.clinicPrice,
          period: '',
          popular: true,
          features: [
            t.pricing.clinicFeatures.allIndividual,
            t.pricing.clinicFeatures.nearbyComparison,
            t.pricing.clinicFeatures.optimization,
            t.pricing.clinicFeatures.dashboard,
            t.pricing.clinicFeatures.listing,
          ],
        },
      ],
    },
    {
      category: 'hospitals',
      title: t.pricing.forHospitals,
      items: [
        {
          name: t.pricing.professional,
          price: t.pricing.professionalPrice,
          period: '',
          popular: false,
          features: [
            t.pricing.professionalFeatures.benchmark,
            t.pricing.professionalFeatures.regionalAnalysis,
            t.pricing.professionalFeatures.priceEvaluation,
            t.pricing.professionalFeatures.aiOptimization,
            t.pricing.professionalFeatures.operationsDashboard,
          ],
        },
        {
          name: t.pricing.enterprise,
          price: t.pricing.enterprisePrice,
          period: '',
          popular: false,
          features: [
            t.pricing.enterpriseFeatures.allProfessional,
            t.pricing.enterpriseFeatures.apiIntegration,
            t.pricing.enterpriseFeatures.customReports,
            t.pricing.enterpriseFeatures.accountManager,
            t.pricing.enterpriseFeatures.quarterlySessions,
          ],
        },
      ],
    },
    {
      category: 'insurance',
      title: t.pricing.forInsuranceCompanies,
      items: [
        {
          name: t.pricing.apiLicense,
          price: t.pricing.apiLicensePrice,
          period: '',
          popular: false,
          features: [
            t.pricing.apiLicenseFeatures.realtimeData,
            t.pricing.apiLicenseFeatures.riskPrediction,
            t.pricing.apiLicenseFeatures.statistics,
          ],
        },
        {
          name: t.pricing.actuarialPackage,
          price: t.pricing.actuarialPrice,
          period: '',
          popular: false,
          features: [
            t.pricing.actuarialFeatures.premiumModel,
            t.pricing.actuarialFeatures.riskPool,
            t.pricing.actuarialFeatures.diseaseAnalysis,
          ],
        },
      ],
    },
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.pricing.title}</h1>
          <p className="text-xl text-gray-700">{t.pricing.subtitle}</p>
        </div>

        {plans.map((planCategory, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">{planCategory.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {planCategory.items.map((plan, planIndex) => (
                <div
                  key={planIndex}
                  className={`bg-white rounded-lg shadow-lg p-8 border-2 ${
                    plan.popular
                      ? 'border-primary transform scale-105'
                      : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-primary text-white text-center py-1 rounded-full text-sm font-semibold mb-4">
                      {t.pricing.mostPopular}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={planCategory.category === 'insurance' ? '/contact' : '/signup'}
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {planCategory.category === 'insurance'
                      ? t.pricing.contactSales
                      : t.pricing.getStarted}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-16 bg-blue-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4 text-center">{t.pricing.whyChoose}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h4 className="font-semibold mb-2">{t.pricing.accuratePredictions}</h4>
              <p className="text-sm text-gray-700">
                {t.pricing.accuratePredictionsDesc}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💰</div>
              <h4 className="font-semibold mb-2">{t.pricing.saveMoney}</h4>
              <p className="text-sm text-gray-700">
                {t.pricing.saveMoneyDesc}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="font-semibold mb-2">{t.pricing.quickEasy}</h4>
              <p className="text-sm text-gray-700">
                {t.pricing.quickEasyDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

