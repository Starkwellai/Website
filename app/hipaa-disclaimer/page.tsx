'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'

export default function HIPAADisclaimerPage() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.hipaa.title}</h1>
          <p className="text-xl text-gray-700 mb-8">{t.hipaa.subtitle}</p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <p className="text-gray-800 font-semibold">{t.hipaa.importantNotice}</p>
          </div>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">{t.hipaa.notMedicalAdvice}</h2>
              <p className="text-gray-700 mb-4">{t.hipaa.notMedicalAdviceDesc}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t.hipaa.hipaaCompliance}</h2>
              <p className="text-gray-700 mb-4">{t.hipaa.hipaaComplianceDesc}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>{t.hipaa.hipaaComplianceItem1}</li>
                <li>{t.hipaa.hipaaComplianceItem2}</li>
                <li>{t.hipaa.hipaaComplianceItem3}</li>
                <li>{t.hipaa.hipaaComplianceItem4}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t.hipaa.dataProtection}</h2>
              <p className="text-gray-700 mb-4">{t.hipaa.dataProtectionDesc}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t.hipaa.limitations}</h2>
              <p className="text-gray-700 mb-4">{t.hipaa.limitationsDesc}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>{t.hipaa.limitationsItem1}</li>
                <li>{t.hipaa.limitationsItem2}</li>
                <li>{t.hipaa.limitationsItem3}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t.hipaa.userResponsibility}</h2>
              <p className="text-gray-700 mb-4">{t.hipaa.userResponsibilityDesc}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t.hipaa.contact}</h2>
              <p className="text-gray-700 mb-4">{t.hipaa.contactDesc}</p>
            </section>

            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <p className="text-sm text-gray-600">
                <strong>{t.hipaa.lastUpdated}:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

