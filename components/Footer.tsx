'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Starkwell</h3>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.footer.care}</h4>
            <ul className="space-y-2">
              <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors">{t.footer.searchForCare}</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">{t.footer.services}</Link></li>
              <li><Link href="/providers" className="text-gray-400 hover:text-white transition-colors">{t.footer.healthcareProviders}</Link></li>
              <li><Link href="/insurance" className="text-gray-400 hover:text-white transition-colors">{t.footer.healthInsurancePlans}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.footer.solutions}</h4>
            <ul className="space-y-2">
              <li><Link href="/solutions/providers" className="text-gray-400 hover:text-white transition-colors">{t.footer.healthcareProviders}</Link></li>
              <li><Link href="/solutions/payers" className="text-gray-400 hover:text-white transition-colors">{t.footer.payers}</Link></li>
              <li><Link href="/solutions/asc" className="text-gray-400 hover:text-white transition-colors">{t.footer.asc}</Link></li>
              <li><Link href="/solutions/employers" className="text-gray-400 hover:text-white transition-colors">{t.footer.employers}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.footer.platform}</h4>
            <ul className="space-y-2">
              <li><Link href="/platform/data" className="text-gray-400 hover:text-white transition-colors">{t.footer.data}</Link></li>
              <li><Link href="/platform/service" className="text-gray-400 hover:text-white transition-colors">{t.footer.serviceManagement}</Link></li>
              <li><Link href="/platform/compliance" className="text-gray-400 hover:text-white transition-colors">{t.footer.compliance}</Link></li>
              <li><Link href="/platform/api" className="text-gray-400 hover:text-white transition-colors">{t.footer.apiResources}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t.footer.aboutUs}</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">{t.footer.companyInformation}</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">{t.footer.careers}</Link></li>
              <li><Link href="/press" className="text-gray-400 hover:text-white transition-colors">{t.footer.pressNews}</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">{t.footer.privacyPolicy}</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">{t.footer.termsOfService}</Link></li>
              <li><Link href="/hipaa-disclaimer" className="text-gray-400 hover:text-white transition-colors">{t.footer.hipaaDisclaimer}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}

