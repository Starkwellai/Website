import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Check, Crown, ArrowLeft } from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

export function SubscriptionTiers() {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started with basic healthcare navigation",
      color: "border-gray-200",
      buttonClass: "border-gray-300",
      buttonVariant: "outline" as const,
      icon: Crown,
      iconColor: "text-gray-400",
      features: [
        "Basic provider search",
        "View provider profiles",
        "Compare up to 3 providers",
        "Book appointments online",
        "Access to health resources",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "Enhanced features for active healthcare seekers",
      color: "border-blue-300 ring-2 ring-blue-100",
      buttonClass: "bg-blue-600 hover:bg-blue-700",
      buttonVariant: "default" as const,
      popular: true,
      icon: Crown,
      iconColor: "text-blue-600",
      features: [
        "Everything in Free, plus:",
        "Unlimited provider comparisons",
        "Price transparency tools",
        "Priority booking",
        "Results interpretation (plain language)",
        "Appointment reminders (SMS & email)",
        "Save favorite providers",
        "Priority customer support",
        "Personalized recommendations",
      ],
    },
    {
      name: "VIP",
      price: "$24.99",
      period: "/month",
      description: "Premium experience with exclusive concierge benefits",
      color: "border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50",
      buttonClass: "bg-purple-600 hover:bg-purple-700",
      buttonVariant: "default" as const,
      icon: Crown,
      iconColor: "text-purple-600",
      features: [
        "Everything in Pro, plus:",
        "Dedicated concierge service",
        "Same-day appointment assistance",
        "Medical record management",
        "Travel healthcare coordination",
        "Second opinion coordination",
        "Prescription price comparison",
        "Healthcare advocacy support",
        "24/7 premium support",
        "Exclusive provider network access",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img 
              src={logo} 
              alt="Starkwell" 
              className="h-20 cursor-pointer rounded-[5px]"
              onClick={() => navigate("/")}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Healthcare Plan
          </h1>
          <p className="text-xl text-gray-600">
            Select the subscription tier that best fits your healthcare needs. All plans include our core features with increasing levels of support and benefits.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <Card 
                key={tier.name} 
                className={`relative ${tier.color} hover:shadow-xl transition-all`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <Icon className={`size-8 ${tier.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600">{tier.period}</span>
                  </div>
                  <CardDescription className="text-base">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={`w-full mb-6 ${tier.buttonClass}`}
                    variant={tier.buttonVariant}
                    onClick={() => navigate("/signup-consumer")}
                  >
                    Get Started
                  </Button>
                  <div className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {feature.endsWith(":") ? (
                          <p className="font-semibold text-gray-900 text-sm">{feature}</p>
                        ) : (
                          <>
                            <Check className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan later?</h3>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your subscription at any time from your account settings. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, debit cards, and digital payment methods. Your billing information is securely stored and encrypted.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">
                  Absolutely. There are no long-term commitments. You can cancel your subscription at any time, and you'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Is my health information secure?</h3>
                <p className="text-gray-600">
                  Yes. We are fully HIPAA compliant and use industry-standard encryption to protect your personal and health information. Your data privacy is our top priority.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
