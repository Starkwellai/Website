import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function ProvidersPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Healthcare Providers</h1>
            <p className="text-lg text-gray-700">
              Discover providers in Utah and compare pricing, quality, and convenience metrics.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">What You Can Compare</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Estimated negotiated rates</li>
                <li>Distance and location</li>
                <li>Wait times and convenience</li>
                <li>Quality and overall scores</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Provider Details</h2>
              <p className="text-gray-700">
                Each provider profile includes location, contact information, services offered, and accepted
                insurance plans (when available).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Get Started</h2>
              <p className="text-gray-700">
                Search providers by service, CPT/HCPCS code, symptoms, ZIP code, and distance.
              </p>
              <Link href="/search" className="btn-primary inline-block mt-4">
                Find Providers
              </Link>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
