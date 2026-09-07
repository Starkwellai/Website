import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-700">
              We are committed to protecting your privacy and ensuring the security of your personal and health
              information. This Privacy Policy explains how we collect, use, disclose, and protect your information.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">HIPAA Compliance</h2>
              <p className="text-gray-700 mb-3">
                We strictly comply with the Health Insurance Portability and Accountability Act (HIPAA) of 1996. All
                Protected Health Information (PHI) is processed in accordance with HIPAA guidelines.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Encrypted data storage and transmission</li>
                <li>Regular security audits and updates</li>
                <li>Strict access controls and authentication</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Information We Collect</h2>
              <div className="text-gray-700 space-y-2">
                <p className="font-semibold">Personal Information</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Name and contact details</li>
                  <li>Date of birth</li>
                  <li>Insurance information</li>
                  <li>Email address</li>
                </ul>
                <p className="font-semibold mt-4">Healthcare Information</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Medical costs and records</li>
                  <li>Treatment information</li>
                  <li>Healthcare provider details</li>
                  <li>Insurance claims</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Analyze medical costs and identify savings opportunities</li>
                <li>Process insurance claims and prior authorizations</li>
                <li>Coordinate care with healthcare providers</li>
                <li>Improve services and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Data Security</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>End-to-end encryption</li>
                <li>Secure authentication</li>
                <li>Secure data storage</li>
                <li>Regular backups</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Your Rights Under HIPAA</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Access your health information</li>
                <li>Request corrections to your information</li>
                <li>Receive copies of your records</li>
                <li>Request restrictions on information sharing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about our privacy practices or wish to exercise your rights, please contact us at
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
