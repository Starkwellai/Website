import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Services</h1>
            <p className="text-lg text-gray-700">
              Explore the healthcare services and procedures supported by Starkwell.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">Common Services</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Primary Care</li>
                <li>Urgent Care</li>
                <li>Mental Health</li>
                <li>Imaging (MRI / X-ray)</li>
                <li>Pediatrics</li>
                <li>Dental Care</li>
                <li>Lab Tests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">CPT / HCPCS Search</h2>
              <p className="text-gray-700">
                You can search by CPT or HCPCS code (e.g., 99213, MRI) or describe symptoms to estimate the
                appropriate code.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Get Started</h2>
              <p className="text-gray-700">
                Ready to compare prices and providers? Start a search and find the best option near you.
              </p>
              <Link href="/search" className="btn-primary inline-block mt-4">
                Start Search
              </Link>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
