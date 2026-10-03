import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Check, Crown, ArrowLeft } from "lucide-react";
import { ComingSoonBadge } from "../components/ComingSoonBadge";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

const SOON = " [soon]";

export function SubscriptionTiers() {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Everything that works today, with no account needed",
      available: true,
      color: "border-gray-200",
      buttonClass: "border-gray-300",
      buttonVariant: "outline" as const,
      icon: Crown,
      iconColor: "text-gray-400",
      features: [
        "Search real prices by procedure",
        "View location profiles and patient reviews",
        "Compare up to 3 locations side by side",
        "Hospital stay and drug price lookups",
        "Access to health resources",
        "Email support",
        "Book appointments online [soon]",
      ],
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "Planned: enhanced features for active healthcare seekers",
      available: false,
      color: "border-blue-300 ring-2 ring-blue-100",
      buttonClass: "bg-blue-600 hover:bg-blue-700",
      buttonVariant: "default" as const,
      popular: true,
      icon: Crown,
      iconColor: "text-blue-600",
      features: [
        "Everything in Free, plus:",
        "Unlimited location comparisons [soon]",
        "Priority booking [soon]",
        "Results interpretation (plain language) [soon]",
        "Appointment reminders (SMS & email) [soon]",
        "Priority customer support [soon]",
        "Personalized recommendations [soon]",
      ],
    },
    {
      name: "VIP",
      price: "$24.99",
      period: "/month",
      description: "Planned: premium experience with concierge benefits",
      available: false,
      color: "border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50",
      buttonClass: "bg-purple-600 hover:bg-purple-700",
      buttonVariant: "default" as const,
      icon: Crown,
      iconColor: "text-purple-600",
      features: [
        "Everything in Pro, plus:",
        "Dedicated concierge service [soon]",
        "Same-day appointment assistance [soon]",
        "Medical record management [soon]",
        "Travel healthcare coordination [soon]",
        "Second opinion coordination [soon]",
        "Healthcare advocacy support [soon]",
        "24/7 premium support [soon]",
        "Exclusive provider network access [soon]",
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
              className="h-12 cursor-pointer rounded-[5px]"
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
            Plans
          </h1>
          <p className="text-xl text-gray-600">
            Starkwell is free to use today. Paid plans are something we&rsquo;re planning, not
            something you can buy yet &mdash; the prices below are what we expect, and the
            features marked &ldquo;coming soon&rdquo; aren&rsquo;t built.
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
                {!tier.available && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <ComingSoonBadge className="bg-white text-xs" />
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
                    {!tier.available && <p className="text-xs text-gray-500 mt-1">Planned price, not final</p>}
                  </div>
                  <CardDescription className="text-base">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tier.available ? (
                    <Button
                      className={`w-full mb-6 ${tier.buttonClass}`}
                      variant={tier.buttonVariant}
                      onClick={() => navigate("/prices")}
                    >
                      Start comparing prices
                    </Button>
                  ) : (
                    <Button className="w-full mb-6" variant="outline" disabled>
                      Not available yet
                    </Button>
                  )}
                  <div className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {feature.endsWith(":") ? (
                          <p className="font-semibold text-gray-900 text-sm">{feature}</p>
                        ) : (
                          <>
                            <Check className={`size-5 flex-shrink-0 mt-0.5 ${feature.endsWith(SOON) ? "text-gray-300" : "text-green-600"}`} />
                            <span className={`text-sm ${feature.endsWith(SOON) ? "text-gray-500" : "text-gray-700"}`}>
                              {feature.replace(SOON, "")}
                              {feature.endsWith(SOON) && <> <ComingSoonBadge /></>}
                            </span>
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
                <h3 className="font-semibold text-gray-900 mb-2">Can I buy Pro or VIP today?</h3>
                <p className="text-gray-600">
                  No. Paid plans and patient accounts aren&rsquo;t live yet, and nothing is charged. The
                  free features above work without signing up.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  None yet &mdash; billing isn&rsquo;t built. We&rsquo;ll announce payment options before any paid plan launches.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Will there be long-term commitments?</h3>
                <p className="text-gray-600">
                  Cancellation terms will be published before any paid plan launches. There&rsquo;s nothing to cancel today.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Is my health information secure?</h3>
                <p className="text-gray-600">
                  We never sell your data and never share it without consent. Full HIPAA-level infrastructure is being built toward, not finished — see our HIPAA Notice for exactly what's true today.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
