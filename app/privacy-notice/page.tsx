'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'

export default function PrivacyNoticePage() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-primary hover:underline mb-4 inline-block">
              ← {t.privacyNotice.backToHome}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🔒 {t.privacyNotice.title}
            </h1>
            <p className="text-xl text-gray-700 mb-2">
              {t.privacyNotice.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="prose max-w-none space-y-6">
              {/* Main Notice */}
              <section>
                <h2 className="text-2xl font-bold mb-4">{t.privacyNotice.mainNotice}</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="text-gray-800 mb-2">{t.privacyNotice.japaneseText}</p>
                  </div>
                  <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                    <p className="text-gray-800 mb-2">{t.privacyNotice.englishText}</p>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-gray-800 text-sm">{t.privacyNotice.romajiText}</p>
                  </div>
                </div>
              </section>

              {/* Key Elements */}
              <section>
                <h2 className="text-2xl font-bold mb-4">🔑 {t.privacyNotice.keyElements}</h2>
                
                <div className="space-y-6">
                  {/* Explicit Consent */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">{t.privacyNotice.explicitConsent}</h3>
                    <p className="text-gray-700 mb-2">{t.privacyNotice.explicitConsentDesc}</p>
                    <p className="text-gray-600 text-sm italic">{t.privacyNotice.explicitConsentNote}</p>
                  </div>

                  {/* Types of Data */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">{t.privacyNotice.typesOfData}</h3>
                    <p className="text-gray-700 mb-2">{t.privacyNotice.typesOfDataDesc}</p>
                    <p className="text-gray-600 text-sm italic">{t.privacyNotice.typesOfDataNote}</p>
                  </div>

                  {/* Purpose of Use */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">{t.privacyNotice.purposeOfUse}</h3>
                    <p className="text-gray-700 mb-2">{t.privacyNotice.purposeOfUseDesc}</p>
                    <p className="text-gray-600 text-sm italic">{t.privacyNotice.purposeOfUseNote}</p>
                  </div>

                  {/* Third Parties */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">{t.privacyNotice.thirdParties}</h3>
                    <p className="text-gray-700 mb-2">{t.privacyNotice.thirdPartiesDesc}</p>
                    <p className="text-gray-600 text-sm italic">{t.privacyNotice.thirdPartiesNote}</p>
                  </div>

                  {/* User Rights */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">{t.privacyNotice.userRights}</h3>
                    <p className="text-gray-700 mb-2">{t.privacyNotice.userRightsDesc}</p>
                    <p className="text-gray-600 text-sm italic">{t.privacyNotice.userRightsNote}</p>
                  </div>
                </div>
              </section>

              {/* References */}
              <section className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-bold mb-2">{t.privacyNotice.references}</h3>
                <p className="text-gray-700 text-sm">{t.privacyNotice.referencesDesc}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

