import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, Lock, CheckCircle, BadgeCheck, ListFilter, ClipboardList, Mail } from "lucide-react";
import { SiteNav } from "../components/SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

export function Trust() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img 
              src={logo} 
              alt="Starkwell" 
              className="h-12 md:h-20 cursor-pointer rounded-[5px]"
              onClick={() => navigate("/")}
            />
            <SiteNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#0f1f3d] text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your health data is safe with us.
            </h1>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Starkwell is built on a foundation of transparency, security, and accountability — for patients and providers alike.
            </p>

            {/* Trust Badges */}
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Shield className="size-10 text-white" />
                </div>
                <h3 className="font-semibold text-lg">HIPAA Compliant</h3>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Lock className="size-10 text-white" />
                </div>
                <h3 className="font-semibold text-lg">256-bit Encryption</h3>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="size-10 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Verified Providers</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIPAA Compliance Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              HIPAA Compliant by design
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left Column - Explanation */}
              <div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  All patient data on Starkwell is handled in full compliance with the Health Insurance Portability and Accountability Act (HIPAA). We never sell your data, never share it without consent, and store it using enterprise-grade encryption.
                </p>
              </div>

              {/* Right Column - Checklist */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">End-to-end encryption for all health data</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">No data sold to third parties — ever</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Role-based access controls</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Regular third-party security audits</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Data deletion available on request</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Integrity Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              We don&rsquo;t make the data look cleaner than it is
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Providers aren&rsquo;t &ldquo;listed&rdquo; on Starkwell — every one comes from a
              federal registry or an insurer&rsquo;s own published rate filing. Here&rsquo;s
              what we actually check, and what we show you instead of hiding.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck className="size-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Active NPI Verification</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Every provider is checked against NPPES, the federal registry that issues
                    National Provider Identifiers. Deactivated NPIs are automatically excluded —
                    we don&rsquo;t independently verify state license or malpractice-insurance
                    status, since neither is part of that federal record.
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ListFilter className="size-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Evidence-Based Matching</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Insurers publish a negotiated rate for everyone in network — including
                    providers who never perform a given service. We check each price against real
                    procedure and specialty history before showing it, and label what we couldn&rsquo;t
                    confirm instead of hiding the gap.
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="size-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Real Quality Data, Not Reviews</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Hospital quality scores come from CMS&rsquo;s own patient-experience and safety
                    surveys — the same federal data hospitals are required to report — not a star
                    rating anyone could game.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Dispute Resolution Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              We have your back
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
              If you encounter an issue with a provider or a price that looks wrong, email us —
              we're a small team, so there's no case-management system yet, but a real person
              reads every message.
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              onClick={() => navigate("/help")}
            >
              <Mail className="mr-2 size-5" />
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-6 gap-8 mb-8">
            <div>
              <img 
                src={logo} 
                alt="Starkwell" 
                className="h-8 mb-4"
              />
              <p className="text-sm text-gray-600">
                Your AI-powered healthcare marketplace for finding care and comparing prices.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">For Patients</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Find a Doctor</a></li>
                <li><a href="#" className="hover:text-blue-600">Compare Prices</a></li>
                <li><button onClick={() => navigate("/prices")} className="hover:text-blue-600">Compare Prices</button></li>
                <li><button onClick={() => navigate("/subscription-tiers")} className="hover:text-blue-600">Subscription Tiers</button></li>
                <li><a href="#" className="hover:text-blue-600">Patient Resources</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">For Providers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Join Starkwell</a></li>
                <li><a href="#" className="hover:text-blue-600">Provider Portal</a></li>
                <li><a href="#" className="hover:text-blue-600">Resources</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact Sales</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Locations</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => navigate("/utah")} className="hover:text-blue-600">Utah Hub</button></li>
                <li><a href="#" className="hover:text-blue-600 text-gray-400">Coming Soon: Arizona</a></li>
                <li><a href="#" className="hover:text-blue-600 text-gray-400">Coming Soon: Nevada</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => navigate("/about")} className="hover:text-blue-600">About</button></li>
                <li><button onClick={() => navigate("/trust")} className="hover:text-blue-600">Trust & Safety</button></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/privacy" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-blue-600">Terms of Service</a></li>
                <li><a href="/hipaa-privacy" className="hover:text-blue-600">HIPAA Notice</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                © 2026 Starkwell. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-600">
                <a href="/privacy" className="hover:text-blue-600">Privacy</a>
                <a href="/terms" className="hover:text-blue-600">Terms</a>
                <a href="/hipaa-privacy" className="hover:text-blue-600">HIPAA</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
