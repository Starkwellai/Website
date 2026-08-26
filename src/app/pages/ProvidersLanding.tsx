import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  Stethoscope,
  Building2,
  BarChart3,
  Award,
  HeartHandshake,
} from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

/**
 * Provider recruitment landing page.
 *
 * Two sections from the original design were removed rather than carried
 * over, because both were entirely fabricated:
 *
 *  - A "stats bar" claiming "50,000+ Active Patients", "2,500+ Verified
 *    Providers", "100,000+ Appointments Booked", "4.9/5 Average Rating".
 *    None of those numbers exist anywhere in this project.
 *  - A testimonials section with three invented doctors (fake names,
 *    specialties, cities, quotes, and 5-star ratings), including a specific
 *    "40% increase in new patient appointments" claim attributed to nobody
 *    real.
 *
 * The benefits/how-it-works/features/pricing sections that remain describe
 * what the product does and how the fee model would work — product-feature
 * copy, not unverifiable measured data — so they stayed, matching how
 * Home.tsx and other marketing pages in this codebase describe features.
 */
export function ProvidersLanding() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Users,
      title: "Reach New Patients",
      description: "Connect with patients actively searching for healthcare services in your area."
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "Set your own prices and showcase them upfront. Patients appreciate the transparency."
    },
    {
      icon: Calendar,
      title: "Streamlined Scheduling",
      description: "Reduce no-shows and phone tag with our integrated appointment booking system."
    },
    {
      icon: TrendingUp,
      title: "Grow Your Practice",
      description: "Build your reputation and increase patient volume through the platform."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Built on a secure platform with encryption and HIPAA compliance as a design requirement."
    },
    {
      icon: Zap,
      title: "Easy Setup",
      description: "Get started in minutes with our simple onboarding process."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Sign up and verify your credentials. Add your practice details, specialties, and availability.",
      icon: Stethoscope
    },
    {
      step: "2",
      title: "Set Your Pricing",
      description: "List your services with transparent pricing. Patients can compare and choose what works for them.",
      icon: DollarSign
    },
    {
      step: "3",
      title: "Accept Appointments",
      description: "Receive booking requests, manage your schedule, and communicate with patients seamlessly.",
      icon: Calendar
    },
    {
      step: "4",
      title: "Build Your Practice",
      description: "Get paid on time and grow your patient base with our practice tools.",
      icon: TrendingUp
    }
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Practice Analytics",
      description: "Track appointment volume, revenue, and patient trends with built-in analytics."
    },
    {
      icon: Building2,
      title: "Multi-Location Support",
      description: "Manage multiple office locations from a single dashboard."
    },
    {
      icon: Award,
      title: "Verified Credentials",
      description: "Display your verified NPI and credentials to build trust."
    },
    {
      icon: HeartHandshake,
      title: "Patient Reviews",
      description: "Collect verified patient reviews once the platform supports them."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-2 md:px-4 py-4">
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt="Starkwell"
              className="h-6 md:h-6 lg:h-16 cursor-pointer rounded-[5px]"
              onClick={() => navigate("/")}
            />
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-gray-700 hover:text-blue-600"
              >
                For Patients
              </Button>
              <Button
                onClick={() => navigate("/provider-signup")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Join Now
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              For Healthcare Providers
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Grow Your Practice with Starkwell
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Connect with patients through transparent pricing, streamlined scheduling, and
              practice management tools built for Utah healthcare providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/provider-signup")}
                className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-8 text-lg"
              >
                Get Started Free
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white hover:bg-white/10 h-14 px-8 text-lg"
              >
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Join Starkwell?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to attract patients, manage your practice, and grow your revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="size-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in four simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <Card className="h-full border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                        {item.step}
                      </div>
                      <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="size-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="size-6 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Practice
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tools designed to help you succeed and provide better patient care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <feature.icon className="size-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600">
                No hidden fees. No long-term contracts. Cancel anytime.
              </p>
            </div>

            <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-blue-600 mb-2">Free to Join</div>
                  <p className="text-xl text-gray-600">Pay only when you get patients</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="size-6 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">No Monthly Fees</div>
                      <div className="text-gray-600">Create your profile and list services at no cost</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="size-6 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">You Set Your Prices</div>
                      <div className="text-gray-600">Full control over your pricing and services</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-100 rounded-lg p-4 text-center">
                  <p className="text-gray-700">
                    <span className="font-semibold">Questions about pricing?</span> Contact our team for a custom quote for enterprise practices.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Grow Your Practice?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join Starkwell to connect with patients and streamline your practice.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/provider-signup")}
              className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-8 text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <p className="mt-4 text-blue-100">
              Set up your profile in minutes • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={logo} alt="Starkwell" className="h-6 md:h-6 lg:h-16 mb-4 rounded-[5px]" />
              <p className="text-sm text-gray-400">
                Connecting patients with quality healthcare providers through transparency and technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Providers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="/provider-signup" className="hover:text-white">Sign Up</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Patients</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-white">Find Providers</a></li>
                <li><a href="/prices" className="hover:text-white">Compare Prices</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="/trust" className="hover:text-white">Trust & Safety</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center text-gray-400">
            <p>&copy; 2026 Starkwell. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
