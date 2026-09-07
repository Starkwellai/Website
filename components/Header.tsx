'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocale } from '@/contexts/LocaleContext'

export default function Header() {
  const { t } = useTranslation()
  const { locale, setLocale } = useLocale()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo%20starkwell%203.png"
              alt="Starkwell Logo"
              className="h-20 md:h-24 w-auto"
              style={{ maxWidth: '400px' }}
            />
          </Link>
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/utah-guide" className="hover:text-primary-200 transition-colors">
                {t.header.utahGuide}
              </Link>
              <Link href="/ai-features" className="hover:text-primary-200 transition-colors">
                {t.header.aiFeatures}
              </Link>
              <Link href="/pricing" className="hover:text-primary-200 transition-colors">
                {t.header.pricing}
              </Link>
              <Link href="/transparency" className="hover:text-primary-200 transition-colors">
                {t.header.transparency}
              </Link>
              <Link href="/resources" className="hover:text-primary-200 transition-colors">
                {t.header.resources}
              </Link>
              <Link href="/signup" className="hover:text-primary-200 transition-colors">
                {t.header.signUp}
              </Link>
              <Link href="/login" className="hover:text-primary-200 transition-colors">
                {t.header.login}
              </Link>
            </nav>
            {/* Language Switcher - Desktop */}
            <div className="hidden md:flex items-center space-x-2 border-l border-primary-300 pl-4 ml-4">
              <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                  locale === 'en'
                    ? 'bg-white text-primary'
                    : 'hover:bg-primary-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale('ja')}
                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                  locale === 'ja'
                    ? 'bg-white text-primary'
                    : 'hover:bg-primary-600'
                }`}
              >
                日本語
              </button>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md hover:bg-primary-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-primary-300 pt-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/utah-guide" 
                className="hover:text-primary-200 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header.utahGuide}
              </Link>
              <Link 
                href="/ai-features" 
                className="hover:text-primary-200 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header.aiFeatures}
              </Link>
              <Link 
                href="/pricing" 
                className="hover:text-primary-200 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header.pricing}
              </Link>
              <Link 
                href="/transparency" 
                className="hover:text-primary-200 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header.transparency}
              </Link>
              <Link 
                href="/resources" 
                className="hover:text-primary-200 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header.resources}
              </Link>
              <Link 
                href="/signup" 
                className="hover:text-primary-200 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header.signUp}
              </Link>
              <Link 
                href="/login" 
                className="hover:text-primary-200 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header.login}
              </Link>
              {/* Language Switcher - Mobile */}
              <div className="flex items-center space-x-2 pt-2 border-t border-primary-300">
                <button
                  onClick={() => {
                    setLocale('en')
                    setMobileMenuOpen(false)
                  }}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    locale === 'en'
                      ? 'bg-white text-primary'
                      : 'hover:bg-primary-600'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    setLocale('ja')
                    setMobileMenuOpen(false)
                  }}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    locale === 'ja'
                      ? 'bg-white text-primary'
                      : 'hover:bg-primary-600'
                  }`}
                >
                  日本語
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

