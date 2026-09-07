import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function InsurancePlansPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Health Insurance Plans</h1>
            <p className="text-lg text-gray-700">
              Learn how insurance affects pricing and how Starkwell uses plan information to estimate costs.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">Negotiated Rates</h2>
              <p className="text-gray-700">
                For insured searches, Starkwell focuses on in-network negotiated rates (allowed amounts). These rates
                are the foundation for transparent comparisons.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Estimated Patient Responsibility</h2>
              <p className="text-gray-700">
                Accurate out-of-pocket amounts require plan details like deductible status, copay, coinsurance, and
                out-of-pocket maximums. When plan details are missing, we provide a clear estimate and refine it after
                you add insurance information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Self-Pay / Cash Options</h2>
              <p className="text-gray-700">
                If you are uninsured, Starkwell highlights discounted cash prices or self-pay list prices when
                available.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Get Started</h2>
              <p className="text-gray-700">
                Ready to compare pricing with or without insurance? Start a search now.
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
