import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SWRProvider } from '@/lib/swr-provider'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { ReCaptchaProvider } from '@/components/ReCaptchaProvider'
import PrivacyTermsModals from '@/components/PrivacyTermsModals'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Starkwell - AI-driven Healthcare Cost Transparency',
  description: 'Compare hospitals, insurance, and specialists fees at a glance. Make smarter healthcare decisions with transparent pricing data.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReCaptchaProvider>
          <LocaleProvider>
            <SWRProvider>
              <PrivacyTermsModals autoShow={true} />
              {children}
            </SWRProvider>
          </LocaleProvider>
        </ReCaptchaProvider>
      </body>
    </html>
  )
}

