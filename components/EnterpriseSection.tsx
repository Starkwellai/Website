'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function EnterpriseSection() {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
    data: true,
    contract: true,
    compliance: false,
  })

  const toggleSection = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t.enterprise.title}
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              {t.enterprise.description}
            </p>
            <Link href="/enterprise" className="btn-primary inline-block">
              {t.enterprise.exploreNow}
            </Link>
            
            <div className="mt-8 space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <button
                  onClick={() => toggleSection('data')}
                  className="flex items-center justify-between w-full font-semibold"
                >
                  <span>{t.enterprise.data}</span>
                  <span>{expanded.data ? '−' : '+'}</span>
                </button>
                {expanded.data && (
                  <div className="mt-4">
                    <p className="text-gray-700 mb-2">{t.enterprise.dataDesc}</p>
                    <Link href="/data" className="text-primary hover:underline">{t.enterprise.learnMore}</Link>
                  </div>
                )}
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <button
                  onClick={() => toggleSection('contract')}
                  className="flex items-center justify-between w-full font-semibold"
                >
                  <span>{t.enterprise.contractManagement}</span>
                  <span>{expanded.contract ? '−' : '+'}</span>
                </button>
                {expanded.contract && (
                  <div className="mt-4">
                    <p className="text-gray-700">{t.enterprise.contractManagementDesc}</p>
                  </div>
                )}
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <button
                  onClick={() => toggleSection('compliance')}
                  className="flex items-center justify-between w-full font-semibold"
                >
                  <span>{t.enterprise.compliance}</span>
                  <span>{expanded.compliance ? '−' : '+'}</span>
                </button>
                {expanded.compliance && (
                  <div className="mt-4">
                    <p className="text-gray-700">{t.enterprise.complianceDesc}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-lg p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🧠</div>
                <p className="text-gray-600">{t.enterprise.analyticsDashboard}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

