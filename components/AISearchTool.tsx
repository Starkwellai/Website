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
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [specialty, setSpecialty] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [distanceMiles, setDistanceMiles] = useState('')
  const [preferences, setPreferences] = useState<string[]>([])
  const [insuranceCardFile, setInsuranceCardFile] = useState<File | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'insurance' | 'self-pay' | 'unsure' | null>(null)
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

  // すべての承諾が完了しているかチェック（リアルタイムで更新）
  const [canUseForm, setCanUseForm] = useState(false)

  const checkAllAgreementsAccepted = () => {
    try {
      const hipaaAccepted = localStorage.getItem('hipaaAcceptedAt')
      const ppAccepted = localStorage.getItem(PP_KEY)
      const touAccepted = localStorage.getItem(TOU_KEY)
      
      return !!(hipaaAccepted && ppAccepted && touAccepted)
    } catch {
      return false
    }
  }

  // 初回チェック
  useEffect(() => {
    setCanUseForm(checkAllAgreementsAccepted())
  }, [])

  // 同意状態の変更を監視（モーダルで同意した後に更新されるように）
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const hipaaAccepted = localStorage.getItem('hipaaAcceptedAt')
        const ppAccepted = localStorage.getItem(PP_KEY)
        const touAccepted = localStorage.getItem(TOU_KEY)
        
        const privacyAccepted = !!ppAccepted
        const termsAccepted = !!touAccepted
        
        setAgreementsStatus({
          privacyAccepted,
          termsAccepted,
          privacyDate: ppAccepted,
          termsDate: touAccepted,
        })

        // すべての承諾が完了しているかチェック
        const allAccepted = !!(hipaaAccepted && ppAccepted && touAccepted)
        setCanUseForm(allAccepted)
      } catch {}
    }

    // ストレージ変更イベントを監視
    window.addEventListener('storage', handleStorageChange)
    
    // 定期的にチェック（同じタブ内での変更も検知）
    const interval = setInterval(handleStorageChange, 500)
    
    // 初回チェック
    handleStorageChange()
    
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

  const handleSearch = () => {
    // 検索結果ページへ遷移
    const params = new URLSearchParams()
    params.set('region', 'UT')
    if (specialty) params.set('specialty', specialty)
    if (symptoms) params.set('symptoms', symptoms)
    if (zipCode) params.set('zip', zipCode)
    if (distanceMiles) params.set('distance', distanceMiles)
    if (preferences.length > 0) params.set('preferences', preferences.join(','))
    if (paymentMethod) params.set('payment', paymentMethod)
    if (selectedPlan) params.set('plan', selectedPlan)
    
    window.location.href = `/search?${params.toString()}`
  }

  const handleNextStep = () => {
    if (step === 1) {
      // Step 1: サービス検索から Step 2: 支払い方法へ
      if (specialty.trim() || symptoms.trim()) {
        setStep(2)
      }
    } else if (step === 2) {
      // Step 2: 支払い方法から Step 3: 保険情報へ（保険を選んだ場合のみ）
      if (paymentMethod === 'insurance') {
        setStep(3)
      } else {
        // 自費または未定の場合は検索結果へ
        handleSearch()
      }
    }
  }

  const canProceedToStep2 = canUseForm && (specialty.trim() || symptoms.trim())

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white via-primary-50/30 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
              {t.search.searchToolTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t.search.searchToolDescription}
            </p>
          </div>

          {/* 同意状態の表示 - 非表示（履歴はlocalStorageに保持） */}
          {/* 同意状態はlocalStorageに保存されているが、UIには表示しない */}
          
          <div className="bg-white rounded-2xl shadow-xl border border-primary-100 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-4">
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    step >= 1 
                      ? 'bg-white text-primary border-white shadow-lg scale-110' 
                      : 'bg-white/20 text-white border-white/50'
                  }`}>
                    {step > 1 ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="font-bold">1</span>
                    )}
                  </div>
                  <div className={`w-12 md:w-16 h-1 mx-2 transition-all duration-300 ${
                    step >= 2 ? 'bg-white' : 'bg-white/30'
                  }`}></div>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    step >= 2 
                      ? 'bg-white text-primary border-white shadow-lg scale-110' 
                      : 'bg-white/20 text-white border-white/50'
                  }`}>
                    {step > 2 ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="font-bold">2</span>
                    )}
                  </div>
                  <div className={`w-12 md:w-16 h-1 mx-2 transition-all duration-300 ${
                    step >= 3 ? 'bg-white' : 'bg-white/30'
                  }`}></div>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    step >= 3 
                      ? 'bg-white text-primary border-white shadow-lg scale-110' 
                      : 'bg-white/20 text-white border-white/50'
                  }`}>
                    <span className="font-bold">3</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 md:p-10">
              {/* Warning if agreements not accepted */}
              {!canUseForm && (
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 mb-1">
                        {t.search.agreementsRequired || 'Please accept all agreements to continue'}
                      </p>
                      <p className="text-xs text-yellow-700">
                        {t.search.agreementsRequiredDesc || 'You must accept HIPAA Disclaimer, Privacy Policy, and Terms of Use before using this form.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: What are you looking for? (Service Search) */}
            {step === 1 && (
              <div className={`space-y-8 animate-in fade-in duration-300 ${!canUseForm ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                    {t.search.step1New || 'What are you looking for?'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t.search.step1NewDescription || 'Search by symptoms, service, or procedure name'}
                  </p>
                </div>

                {/* What are you looking for? */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {t.search.whatAreYouLookingFor}
                  </label>
                  
                  {/* Search Bar */}
                  <div className="mb-4">
                    <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <svg className="h-5 w-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        placeholder={t.search.findCare || "Search for care, specialty, or condition..."}
                        className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                      />
                      {specialty && (
                        <button
                          type="button"
                          onClick={() => setSpecialty('')}
                          className="mr-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>


                  {/* Quick Select Buttons */}
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-2">{t.search.quickOptions || 'Or select from quick options:'}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'urgent', label: t.search.urgentCare, icon: '⚡' },
                      { value: 'primary', label: t.search.primaryCare, icon: '🏥' },
                      { value: 'mental', label: t.search.mentalHealth || 'Mental Health', icon: '🧠' },
                      { value: 'imaging', label: t.search.imaging || 'Imaging (MRI/X-ray)', icon: '📷' },
                      { value: 'obgyn', label: t.search.obgyn, icon: '👩' },
                      { value: 'pediatric', label: t.search.pediatric || 'Pediatric', icon: '👶' },
                      { value: 'dental', label: t.search.dental, icon: '🦷' },
                      { value: 'lab', label: t.search.labTests || 'Lab Tests', icon: '🔬' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSpecialty(option.label)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                          specialty === option.label || specialty === option.value
                            ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white border-primary-600 shadow-lg scale-105'
                            : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md hover:scale-102'
                        }`}
                      >
                        <span className="text-xl mb-1 block">{option.icon}</span>
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {t.search.symptoms} {t.search.optional ? `(${t.search.optional})` : '(Optional)'}
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder={t.search.symptomsPlaceholder}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    rows={4}
                  />
                </div>

                {/* Location Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                      </svg>
                      {t.search.regionLabel}
                    </label>
                    <input
                      type="text"
                      value={t.search.regionValue}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M12 3v18" />
                      </svg>
                      {t.search.distanceLabel} {t.search.optional ? `(${t.search.optional})` : '(Optional)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={distanceMiles}
                      onChange={(e) => setDistanceMiles(e.target.value)}
                      placeholder={t.search.distancePlaceholder}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">{t.search.distanceUnit}</p>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t.search.location} {t.search.optional ? `(${t.search.optional})` : '(Optional)'}
                    </label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder={t.search.zipPlaceholder}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Next Step Button */}
                <div className="flex justify-end mt-10 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!canProceedToStep2}
                    className={`px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center gap-2 ${
                      canProceedToStep2
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {t.search.nextStep}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method Selection */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                    {t.search.step2New || 'How will you pay?'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t.search.step2NewDescription || 'Please select your payment method'}
                  </p>
                </div>

                <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-2">{t.search.pricingNoteTitle}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t.search.pricingNoteInsurance}</li>
                    <li>{t.search.pricingNoteCash}</li>
                    <li>{t.search.pricingNoteEstimate}</li>
                  </ul>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('insurance')}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      paymentMethod === 'insurance'
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white border-primary-600 shadow-lg scale-105'
                        : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{t.search.paymentMethodInsurance || 'Use Insurance'}</h4>
                        <p className="text-sm opacity-75">{t.search.paymentMethodInsuranceDesc || 'If you have an insurance plan'}</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('self-pay')}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      paymentMethod === 'self-pay'
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white border-primary-600 shadow-lg scale-105'
                        : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{t.search.paymentMethodSelfPay || 'Self-Pay / Cash'}</h4>
                        <p className="text-sm opacity-75">{t.search.paymentMethodSelfPayDesc || 'Pay without insurance'}</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('unsure')}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      paymentMethod === 'unsure'
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white border-primary-600 shadow-lg scale-105'
                        : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{t.search.paymentMethodUnsure || 'Not Sure Yet'}</h4>
                        <p className="text-sm opacity-75">{t.search.paymentMethodUnsureDesc || 'Decide later'}</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t.search.previousStep}
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!paymentMethod}
                    className={`px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center gap-2 ${
                      paymentMethod
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {paymentMethod === 'insurance' ? t.search.nextStep : t.search.search}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paymentMethod === 'insurance' ? "M13 7l5 5m0 0l-5 5m5-5H6" : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"} />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Insurance Information (Optional, only if insurance selected) */}
            {step === 3 && (
              <div className={`space-y-8 animate-in fade-in duration-300 ${!canUseForm ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                    {t.search.step3 || 'Insurance Information'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t.search.step3Description || "Optional. You can skip if you don't know your plan."}
                  </p>
                </div>

                {/* Insurance Card Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {t.search.uploadCard}
                  </label>
                  <div className="border-2 border-dashed border-primary-200 rounded-xl p-8 text-center hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200">
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
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <span className={`text-sm font-medium ${
                        insuranceCardFile ? 'text-primary' : 'text-gray-600'
                      }`}>
                        {insuranceCardFile ? (
                          <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {insuranceCardFile.name}
                          </span>
                        ) : (
                          t.search.uploadCardPlaceholder
                        )}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                  </div>
                </div>

                {/* Insurance Plan Selector */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t.utah.insurancePlans} {t.search.optional ? `(${t.search.optional})` : '(Optional)'}
                  </label>
                  <div className="bg-gray-50 rounded-xl p-1 border border-gray-200">
                    <InsurancePlanSelector
                      selectedPlan={selectedPlan}
                      onPlanSelect={setSelectedPlan}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {t.search.step3Description || "You can skip if you don't know your plan"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t.search.previousStep}
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                    >
                      スキップ / Skip
                    </button>
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                    >
                      {t.search.search}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy and Terms Modals - リンククリック時に表示 */}
      <PrivacyTermsModals autoShow={false} />
    </section>
  )
}
