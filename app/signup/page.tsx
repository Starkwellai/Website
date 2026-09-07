'use client'

import { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

type UserType = 'consumer' | 'professional'

export default function SignUpPage() {
  const { t } = useTranslation()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [userType, setUserType] = useState<UserType>('consumer')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Professional fields
    medicalLicense: '',
    hospitalName: '',
    position: '',
    purpose: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Get reCAPTCHA token
      let recaptchaToken = ''
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha('signup_form')
      }

      // Handle signup logic here
      console.log('Sign up:', { userType, ...formData, recaptchaToken })
      
      // TODO: Implement API endpoint for signup
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">{t.signupPage.title}</h1>
            <p className="text-gray-700">
              {t.signupPage.description}
            </p>
          </div>

          {/* User Type Selection Tabs */}
          <div className="bg-white border border-gray-200 rounded-lg p-2 mb-6 shadow-md">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUserType('consumer')}
                className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                  userType === 'consumer'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.signupPage.forConsumers}
              </button>
              <button
                type="button"
                onClick={() => setUserType('professional')}
                className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                  userType === 'professional'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.signupPage.forHealthcareProfessionals}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8 shadow-md">
            {/* Section Title */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-2">
                {userType === 'consumer' ? t.signupPage.consumerTitle : t.signupPage.professionalTitle}
              </h2>
              <p className="text-gray-600 text-sm">
                {userType === 'consumer' ? t.signupPage.consumerDescription : t.signupPage.professionalDescription}
              </p>
            </div>

            {/* Consumer Form Fields */}
            {userType === 'consumer' && (
              <>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    {t.signupPage.fullNameOptional}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    {t.signupPage.emailAddress}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-semibold mb-2">
                    {t.signupPage.password}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
                    {t.signupPage.confirmPassword}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}

            {/* Professional Form Fields */}
            {userType === 'professional' && (
              <>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    {t.signupPage.fullName}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    {t.signupPage.emailAddress}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="medicalLicense" className="block text-sm font-semibold mb-2">
                    {t.signupPage.medicalLicense}
                  </label>
                  <select
                    id="medicalLicense"
                    name="medicalLicense"
                    value={formData.medicalLicense}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t.signupPage.medicalLicensePlaceholder}</option>
                    <option value="doctor">{t.signupPage.licenseDoctor}</option>
                    <option value="nurse">{t.signupPage.licenseNurse}</option>
                    <option value="physician">{t.signupPage.licensePhysician}</option>
                    <option value="other">{t.signupPage.licenseOther}</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="hospitalName" className="block text-sm font-semibold mb-2">
                    {t.signupPage.hospitalName}
                  </label>
                  <input
                    type="text"
                    id="hospitalName"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t.signupPage.hospitalNamePlaceholder}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="position" className="block text-sm font-semibold mb-2">
                    {t.signupPage.position}
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t.signupPage.positionPlaceholder}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="purpose" className="block text-sm font-semibold mb-2">
                    {t.signupPage.purpose}
                  </label>
                  <select
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t.signupPage.purposePlaceholder}</option>
                    <option value="clinical">{t.signupPage.purposeClinical}</option>
                    <option value="management">{t.signupPage.purposeManagement}</option>
                    <option value="both">{t.signupPage.purposeBoth}</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-semibold mb-2">
                    {t.signupPage.password}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
                    {t.signupPage.confirmPassword}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}

            {/* Terms Agreement */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="mr-2 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  {t.signupPage.agreeTo}{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    {t.footer.termsOfService}
                  </Link>{' '}
                  {t.signupPage.and}{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    {t.footer.privacyPolicy}
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : t.signupPage.createAccount}
            </button>

            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                Account created successfully! Please check your email to verify your account.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                There was an error creating your account. Please try again.
              </div>
            )}

            <p className="text-center text-sm text-gray-700">
              {t.signupPage.alreadyHaveAccount}{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                {t.signupPage.signIn}
              </Link>
            </p>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t.signupPage.bySigningUp}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
