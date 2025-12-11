'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocale } from '@/contexts/LocaleContext'

export default function Header() {
  const { t } = useTranslation()
  const { locale, setLocale } = useLocale()
  const [logoError, setLogoError] = useState(false)

  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {logoError ? (
              <span className="text-2xl font-bold">Starkwell</span>
            ) : (
              <>
                <Image
                  src="/logo.png"
                  alt="Starkwell Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                  onError={() => setLogoError(true)}
                  priority
                />
                <span className="text-2xl font-bold sr-only">Starkwell</span>
              </>
            )}
          </Link>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/utah-guide" className="hover:text-blue-200 transition-colors">
                {t.header.utahGuide}
              </Link>
              <Link href="/ai-features" className="hover:text-blue-200 transition-colors">
                {t.header.aiFeatures}
              </Link>
              <Link href="/pricing" className="hover:text-blue-200 transition-colors">
                {t.header.pricing}
              </Link>
              <Link href="/transparency" className="hover:text-blue-200 transition-colors">
                {t.header.transparency}
              </Link>
              <Link href="/resources" className="hover:text-blue-200 transition-colors">
                {t.header.resources}
              </Link>
              <Link href="/signup" className="hover:text-blue-200 transition-colors">
                {t.header.signUp}
              </Link>
              <Link href="/login" className="hover:text-blue-200 transition-colors">
                {t.header.login}
              </Link>
            </nav>
            <div className="flex items-center space-x-2 border-l border-blue-300 pl-4 ml-4">
              <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                  locale === 'en'
                    ? 'bg-white text-primary'
                    : 'hover:bg-blue-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale('ja')}
                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                  locale === 'ja'
                    ? 'bg-white text-primary'
                    : 'hover:bg-blue-600'
                }`}
              >
                日本語
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

