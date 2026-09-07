import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-700">
              These Terms of Service govern your use of Starkwell and related services. By accessing or using the
              platform, you agree to be bound by these Terms. Do not use the platform if you disagree.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using Starkwell, you agree to be bound by these Terms of Service and all applicable
                laws and regulations. If you do not agree with any of these terms, you are prohibited from using or
                accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Use License</h2>
              <p className="text-gray-700 mb-3">
                Permission is granted to temporarily access the materials on Starkwell for personal, non-commercial
                use. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software contained on Starkwell</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. Healthcare Disclaimer</h2>
              <p className="text-gray-700">
                The content provided on Starkwell is for informational purposes only and is not intended as medical
                advice, or as a substitute for the medical advice of a licensed healthcare professional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Account Terms</h2>
              <p className="text-gray-700 mb-3">
                You are responsible for maintaining the security of your account and password. Starkwell cannot and
                will not be liable for any loss or damage from your failure to comply with this security obligation.
              </p>
              <p className="text-gray-700">
                You are responsible for all content posted and activity that occurs under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Privacy and Data Protection</h2>
              <p className="text-gray-700">
                Your use of Starkwell is also governed by our Privacy Policy. Please review our Privacy Policy to
                understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Limitations</h2>
              <p className="text-gray-700">
                Starkwell shall not be liable for any damages arising out of the use or inability to use the materials
                on our platform. Some jurisdictions do not allow limitations on implied warranties or limitations of
                liability for incidental damages, these limitations may not apply to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Revisions</h2>
              <p className="text-gray-700">
                Starkwell may revise these terms of service at any time without notice. By using this platform you are
                agreeing to be bound by the current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Governing Law</h2>
              <p className="text-gray-700">
                These terms and conditions are governed by and construed in accordance with the laws of the United
                States and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Last Updated</h2>
              <p className="text-gray-700">January 1, 2025</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Contact</h2>
              <p className="text-gray-700">
                For questions about these terms, please contact us at
                <a href="mailto:info@starkwell.jp" className="text-primary hover:underline ml-1">
                  info@starkwell.jp
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
