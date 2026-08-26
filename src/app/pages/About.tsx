import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Check, MapPin } from "lucide-react";
import { SiteNav } from "../components/SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

export function About() {
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
      <section className="bg-[#0f172a] text-white py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              We built Starkwell because navigating healthcare shouldn't require a personal advisor.
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              For decades, if you could afford a concierge doctor or a health advisor, someone guided you through the system. Everyone else was on their own. We're changing that.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Healthcare has a navigation problem.
            </h2>

            {/* Stat Callouts */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-red-50 border-2 border-red-200">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-bold text-red-600 mb-4">3x</div>
                  <p className="text-gray-700 mb-2">
                    The same procedure can cost 3x more at a hospital vs an imaging center
                  </p>
                  <p className="text-[10px] text-[#9ca3af]">
                    Source: GoodRx / Clermont Radiology
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-2 border-orange-200">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-bold text-orange-600 mb-4">254%</div>
                  <p className="text-gray-700 mb-2">
                    The average hospital bill vs. what Medicare pays
                  </p>
                  <p className="text-[10px] text-[#9ca3af]">
                    Source: RAND Corporation, 2024
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-2 border-yellow-200">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-bold text-yellow-600 mb-4">73%</div>
                  <p className="text-gray-700 mb-2">
                    of patients are unaware they can compare prices before their visit
                  </p>
                  <p className="text-[10px] text-[#9ca3af]">
                    Source: National Library of Medicine, 2024
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                The opacity of American healthcare pricing isn't an accident. And the patients who suffer most from it are the ones least equipped to navigate it alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Democratizing the concierge experience.
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column - What concierge gives the wealthy */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  What concierge medicine gives the wealthy
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div>
                    <span className="text-gray-700">Guidance on which specialist to see</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div>
                    <span className="text-gray-700">Price comparisons before you book</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div>
                    <span className="text-gray-700">Plain-language explanations of results</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div>
                    <span className="text-gray-700">Someone in your corner when things go wrong</span>
                  </li>
                </ul>
              </div>

              {/* Right Column - What Starkwell gives everyone */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  What Starkwell gives everyone
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="size-4 text-white" />
                    </div>
                    <span className="text-gray-700">AI-powered provider matching</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="size-4 text-white" />
                    </div>
                    <span className="text-gray-700">Real prices side by side before you book</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="size-4 text-white" />
                    </div>
                    <span className="text-gray-700">Plain-language result summaries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="size-4 text-white" />
                    </div>
                    <span className="text-gray-700">HIPAA-secure and always in your corner</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Utah Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="size-16 text-blue-600" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Starting in Utah.
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Utah's self-pay and elective care market is one of the most dynamic in the country. With a price-conscious population, a growing independent provider ecosystem, and patients already making active healthcare decisions outside of insurance, Utah is the perfect place to prove the model — before expanding nationwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-teal-500 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Ready to take control of your healthcare?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/signup-consumer")}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
              >
                Find Care Near You
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/signup-provider")}
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8"
              >
                List Your Practice
              </Button>
            </div>
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
                Your AI-powered healthcare marketplace for finding care, comparing prices, and booking appointments.
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
