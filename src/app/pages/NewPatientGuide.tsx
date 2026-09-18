import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Mail, FileText, Phone, Smartphone } from "lucide-react";
import { SiteNav } from "../components/SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

/**
 * A content-only page — no upload, no storage, nothing that touches anyone's
 * actual medical data. This is deliberately the light version of "help
 * people bring their history to a new visit": the real upload-and-store
 * feature needs real user accounts, HTTPS, encrypted storage, and a legal
 * review of HIPAA/state health-privacy obligations before a line of that
 * code gets written. This page gets most of the practical value today, at
 * zero cost and zero liability, by pointing people to what already exists
 * (their provider's own portal, Apple Health) instead of rebuilding it.
 */

const CHECKLIST_ITEMS = [
  "Photo ID",
  "Insurance card (front and back)",
  "Current medications and dosages — the bottles themselves work fine",
  "Known allergies (medications, food, environmental)",
  "Past surgeries or major procedures, with approximate dates",
  "Immunization history, if relevant to this visit",
  "Recent test results or imaging related to why you're being seen",
  "Family medical history — major conditions in parents or siblings",
  "Names of your other current doctors or specialists",
  "Referral paperwork, if another provider sent you here",
  "A way to pay your copay",
];

export function NewPatientGuide() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt="Starkwell"
              className="h-9 md:h-12 cursor-pointer rounded-[5px]"
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
              Getting ready for a new patient visit
            </h1>
            <p className="text-lg text-blue-100">
              Once you've found where to go, a little prep makes the first visit go a lot
              smoother — starting with your own medical history.
            </p>
          </div>
        </div>
      </section>

      {/* Getting your records */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Getting your records from a previous provider
            </h2>
            <p className="text-gray-600 mb-8">
              You have a legal right to your own medical records — providers are required
              to give you access, generally within 30 days of asking. A few ways to actually
              get them:
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Check for a patient portal first</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Utah's two largest systems — Intermountain Health and University of Utah
                    Health — both use a portal called <strong>MyChart</strong>. Many smaller
                    practices use it too. Log in, and look for "Health Summary," "Documents,"
                    or a "Share Everywhere" / download option — most of what a new provider
                    needs is exportable in a few clicks, for free, without calling anyone.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">If you have an iPhone</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The built-in Health app can pull records directly from many participating
                    hospitals — look under Health Records. If your provider is connected,
                    this can be the fastest option, and it stays on your device, not with
                    Apple or anyone else.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">No portal, or an older provider?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Call their medical records department directly and ask for a copy of
                    your records. They'll likely have you sign a short release form and
                    confirm your identity. It can take several business days, so ask as
                    early as you reasonably can before your new appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What to bring to a new patient visit
            </h2>
            <p className="text-gray-600 mb-8">
              A quick checklist — nothing here is saved or sent anywhere, it's just for you
              to work through before you go.
            </p>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {CHECKLIST_ITEMS.map((item, i) => (
                <label
                  key={i}
                  className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50"
                >
                  <Checkbox
                    checked={checked.has(i)}
                    onCheckedChange={() => toggle(i)}
                    className="mt-0.5"
                  />
                  <span className={checked.has(i) ? "text-gray-400 line-through" : "text-gray-700"}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {checked.size} of {CHECKLIST_ITEMS.length} checked off
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Have a question this didn't answer?
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
              <img src={logo} alt="Starkwell" className="h-8 mb-4" />
              <p className="text-sm text-gray-600">
                Your AI-powered healthcare marketplace for finding care and comparing prices.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">For Patients</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => navigate("/prices")} className="hover:text-blue-600">Compare Prices</button></li>
                <li><button onClick={() => navigate("/new-patient-guide")} className="hover:text-blue-600">New Patient Guide</button></li>
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
