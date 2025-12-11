'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import InsurancePlanSelector from './InsurancePlanSelector'
import PrivacyTermsModals from './PrivacyTermsModals'

const PP_KEY = 'ppAcceptedAt'
const TOU_KEY = 'touAcceptedAt'

export default function AISearchTool() {
  const { t } = useTranslation()
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [specialty, setSpecialty] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [preferences, setPreferences] = useState<string[]>([])
  const [insuranceCardFile, setInsuranceCardFile] = useState<File | null>(null)
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const [agreementsStatus, setAgreementsStatus] = useState<{
    privacyAccepted: boolean
    termsAccepted: boolean
    privacyDate: string | null
    termsDate: string | null
  }>({
    privacyAccepted: false,
    termsAccepted: false,
    privacyDate: null,
    termsDate: null,
  })

  // 同意状態を確認
  useEffect(() => {
    try {
      const ppAccepted = localStorage.getItem(PP_KEY)
      const touAccepted = localStorage.getItem(TOU_KEY)
      
      setAgreementsStatus({
        privacyAccepted: !!ppAccepted,
        termsAccepted: !!touAccepted,
        privacyDate: ppAccepted,
        termsDate: touAccepted,
      })
    } catch {
      // localStorageが利用できない場合
    }
  }, [])

  // 同意状態の変更を監視（モーダルで同意した後に更新されるように）
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const ppAccepted = localStorage.getItem(PP_KEY)
        const touAccepted = localStorage.getItem(TOU_KEY)
        
        setAgreementsStatus({
          privacyAccepted: !!ppAccepted,
          termsAccepted: !!touAccepted,
          privacyDate: ppAccepted,
          termsDate: touAccepted,
        })
      } catch {}
    }

    // ストレージ変更イベントを監視
    window.addEventListener('storage', handleStorageChange)
    
    // 定期的にチェック（同じタブ内での変更も検知）
    const interval = setInterval(handleStorageChange, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    )
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInsuranceCardFile(e.target.files[0])
      // AI would process the card here
      console.log('Insurance card uploaded:', e.target.files[0].name)
    }
  }

  const handleNextStep = () => {
    // Validate insurance information and disclaimer before proceeding
    if ((selectedPlan || insuranceCardFile) && disclaimerAccepted) {
      setStep(2)
    }
  }

  const canProceedToStep2 = (selectedPlan !== null || insuranceCardFile !== null) && disclaimerAccepted

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {t.search.searchToolTitle}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {t.search.searchToolDescription}
          </p>

          {/* 同意状態の表示 */}
          {(agreementsStatus.privacyAccepted || agreementsStatus.termsAccepted) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800 mb-2">
                    {t.search.agreementsAccepted || 'Agreements Accepted / 同意済み'}
                  </h3>
                  <div className="space-y-1 text-sm text-green-700">
                    {agreementsStatus.privacyAccepted && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">✓ Privacy Policy:</span>
                        <span>{formatDate(agreementsStatus.privacyDate)}</span>
                      </div>
                    )}
                    {agreementsStatus.termsAccepted && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">✓ Terms of Use:</span>
                        <span>{formatDate(agreementsStatus.termsDate)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    {t.search.agreementsNote || 'You can now use the search tool. / 検索ツールをご利用いただけます。'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= 1 ? 'bg-primary text-white border-primary' : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  1
                </div>
                <div className={`w-24 h-1 mx-2 ${
                  step >= 2 ? 'bg-primary' : 'bg-gray-300'
                }`}></div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= 2 ? 'bg-primary text-white border-primary' : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  2
                </div>
              </div>
            </div>

            {/* Step 1: Insurance Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{t.search.step1}</h3>
                  <p className="text-gray-600 mb-6">{t.search.step1Description}</p>
                </div>

                {/* Insurance Card Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t.search.uploadCard}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="insurance-card"
                    />
                    <label
                      htmlFor="insurance-card"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {insuranceCardFile ? insuranceCardFile.name : t.search.uploadCardPlaceholder}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="text-center text-gray-500 my-4">OR</div>

                {/* Insurance Plan Selector */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t.utah.insurancePlans}
                  </label>
                  <InsurancePlanSelector
                    selectedPlan={selectedPlan}
                    onPlanSelect={setSelectedPlan}
                  />
                </div>

                {/* Disclaimer */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={disclaimerAccepted}
                      onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                      className="mt-1 mr-3 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      required
                    />
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-800 block mb-1">
                        {t.search.disclaimer}
                      </span>
                      <span className="text-sm text-gray-700">
                        {t.search.disclaimerText}
                      </span>
                    </div>
                  </label>
                  <div className="mt-3 pt-3 border-t border-blue-200 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).openPrivacyModal) {
                          (window as any).openPrivacyModal()
                        }
                      }}
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1 text-left"
                    >
                      {t.search.readPrivacyNotice}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).openTermsModal) {
                          (window as any).openTermsModal()
                        }
                      }}
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1 text-left"
                    >
                      {t.search.readTermsOfUse || 'Read Terms of Use / 利用規約を読む'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Next Step Button */}
                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!canProceedToStep2}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      canProceedToStep2
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {t.search.nextStep}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: What are you looking for? */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{t.search.step2}</h3>
                  <p className="text-gray-600 mb-6">{t.search.step2Description}</p>
                </div>

                {/* What are you looking for? */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t.search.whatAreYouLookingFor}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'primary', label: t.search.primaryCare },
                      { value: 'urgent', label: t.search.urgentCare },
                      { value: 'obgyn', label: t.search.obgyn },
                      { value: 'dental', label: t.search.dental },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSpecialty(option.value)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          specialty === option.value
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white border-gray-300 hover:border-primary'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t.search.symptoms}
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder={t.search.symptomsPlaceholder}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t.search.location}
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g., 84101 (Salt Lake City)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Preferences */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t.search.preferences}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { key: 'cheapest', label: t.search.cheapest },
                      { key: 'closest', label: t.search.closest },
                      { key: 'shortestWait', label: t.search.shortestWait },
                      { key: 'japaneseSupport', label: t.search.japaneseSupport },
                      { key: 'highRating', label: t.search.highRating },
                    ].map((pref) => (
                      <button
                        key={pref.key}
                        type="button"
                        onClick={() => togglePreference(pref.key)}
                        className={`px-4 py-2 rounded-full border transition-colors ${
                          preferences.includes(pref.key)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white border-gray-300 hover:border-primary'
                        }`}
                      >
                        {pref.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {t.search.previousStep}
                  </button>
                  <Link
                    href={`/search?plan=${selectedPlan || ''}&specialty=${specialty}&symptoms=${encodeURIComponent(symptoms)}&zip=${zipCode}&preferences=${preferences.join(',')}`}
                    className="px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    {t.search.search}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Privacy and Terms Modals - リンククリック時に表示 */}
      <PrivacyTermsModals autoShow={false} />
    </section>
  )
}
