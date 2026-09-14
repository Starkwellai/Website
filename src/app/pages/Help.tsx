import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "../components/ui/accordion";
import { Mail } from "lucide-react";
import { SiteNav } from "../components/SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Where do these prices come from?",
    a: "Every price on Starkwell comes from a rate insurers are legally required to publish under the federal price transparency rule (the \"Transparency in Coverage\" rule) — the same negotiated rate they pay a provider, not an estimate or a survey. We don't set prices, negotiate them, or adjust them.",
  },
  {
    q: "Why does a service show a \"typical\" price and a separate full range?",
    a: "Insurers' published files routinely include placeholder rates from blanket network contracts — for example, a $0.01 rate for a service a provider never actually performs. The typical price excludes those outliers so the headline number reflects real care; the full range is never hidden, just one tap away.",
  },
  {
    q: "What do the \"confirmed,\" \"likely,\" and \"in network\" labels mean?",
    a: "A price being published doesn't always mean that provider performs that service — insurers price everyone in network for nearly everything. We check each price against real procedure and specialty history and label what we could and couldn't confirm, instead of showing every in-network rate as if it were a sure thing.",
  },
  {
    q: "How often is the pricing data updated?",
    a: "Monthly, from each insurer's newest published files. We deliberately never combine multiple months into one average — a price you see is from one specific month's filing, not a blend.",
  },
  {
    q: "Is Starkwell an insurance company, or can I buy a plan here?",
    a: "No. Starkwell doesn't sell insurance or negotiate rates — we only help you compare the prices insurers have already agreed to pay. For coverage questions, contact your insurer or a licensed broker.",
  },
  {
    q: "What areas does Starkwell cover?",
    a: "Utah only, for now. We're evaluating additional states, but haven't published pricing anywhere else yet.",
  },
  {
    q: "I found a price that looks wrong. What do I do?",
    a: "Email us the service, provider, and what you saw, and we'll look into it. Since every price traces back to an insurer's own published file, most \"wrong-looking\" prices turn out to be a real (if surprising) blanket-contract rate — but we do want to know about genuine data errors.",
  },
  {
    q: "Is my search activity private?",
    a: "See our Privacy Policy and HIPAA Notice for the full detail — in short, we don't sell your data and don't share it without consent.",
  },
];

export function Help() {
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

      {/* Hero */}
      <section className="bg-[#0f1f3d] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Help &amp; Support
            </h1>
            <p className="text-lg text-blue-100">
              Answers to the questions people ask most, plus how to reach us for anything else.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-gray-900">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Still have a question?
            </h2>
            <p className="text-gray-600 mb-8">
              We're a small team, so there's no live chat or phone line yet — but a real
              person reads every email.
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              onClick={() => { window.location.href = "mailto:support@starkwell.com"; }}
            >
              <Mail className="mr-2 size-5" />
              support@starkwell.com
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
                <li><button onClick={() => navigate("/prices")} className="hover:text-blue-600">Compare Prices</button></li>
                <li><button onClick={() => navigate("/subscription-tiers")} className="hover:text-blue-600">Subscription Tiers</button></li>
                <li><button onClick={() => navigate("/help")} className="hover:text-blue-600">Help</button></li>
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
