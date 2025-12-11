'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'

export default function TransparencyPage() {
  const { t } = useTranslation()
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.transparencyPage.title}</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">{t.transparencyPage.whatIs}</h2>
              <p className="text-lg text-gray-700 mb-4">
                {t.transparencyPage.description1}
              </p>
              <p className="text-lg text-gray-700">
                {t.transparencyPage.description2}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">{t.transparencyPage.whyMatters}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">{t.transparencyPage.empowerPatients}</h3>
                  <p className="text-gray-700">
                    {t.transparencyPage.empowerPatientsDesc}
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">{t.transparencyPage.reduceSurprises}</h3>
                  <p className="text-gray-700">
                    {t.transparencyPage.reduceSurprisesDesc}
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">{t.transparencyPage.promoteCompetition}</h3>
                  <p className="text-gray-700">
                    {t.transparencyPage.promoteCompetitionDesc}
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">{t.transparencyPage.improveOutcomes}</h3>
                  <p className="text-gray-700">
                    {t.transparencyPage.improveOutcomesDesc}
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">{t.transparencyPage.keyRegulations}</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-bold mb-2">{t.transparencyPage.hospitalRule}</h3>
                  <p className="text-gray-700">
                    {t.transparencyPage.hospitalRuleDesc}
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-bold mb-2">{t.transparencyPage.coverageRule}</h3>
                  <p className="text-gray-700">
                    {t.transparencyPage.coverageRuleDesc}
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-bold mb-2">{t.transparencyPage.noSurprisesAct}</h3>
                  <p className="text-gray-700">
                    {t.transparencyPage.noSurprisesActDesc}
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12 bg-primary text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">{t.transparencyPage.ourCommitment}</h2>
              <p className="text-lg mb-4">
                {t.transparencyPage.commitment1}
              </p>
              <p className="text-lg">
                {t.transparencyPage.commitment2}
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

