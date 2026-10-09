import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ComingSoonBadge } from "../components/ComingSoonBadge";
import { Search, Building2, Pill, Bookmark } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";

/**
 * Where every patient "Sign up / Log in" button lands. There is no patient
 * account system yet, and the old sign-up forms collected a name, email and
 * password and then discarded them, which read as if an account had been made.
 * This page says so plainly and points at what works without one. It
 * deliberately collects nothing, not even an email for a waitlist, because
 * there is nowhere safe to put it yet.
 */
export function AccountsComingSoon() {
  const navigate = useNavigate();
  const today = [
    { icon: Search, title: "Compare procedure prices", to: "/prices", text: "Real negotiated rates from insurers' published files." },
    { icon: Building2, title: "Hospital stays", to: "/hospital-stays", text: "What a hospital stay costs, by facility." },
    { icon: Pill, title: "Drug prices", to: "/drug-prices", text: "Cash prices for common prescriptions." },
    { icon: Bookmark, title: "Saved items", to: "/saved", text: "Bookmarks kept in this browser." },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="mb-3"><ComingSoonBadge /></div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Patient accounts aren&rsquo;t live yet</h1>
        <p className="text-lg text-gray-600 mb-2">
          We plan to add accounts, but today there is nothing to sign up for. So we&rsquo;re not
          asking for a name, email or password. You don&rsquo;t need an account to use the
          parts of Starkwell that work.
        </p>
        <p className="text-gray-600 mb-8">
          Are you a practice? You can{" "}
          <a href="/provider-signup" className="text-blue-600 hover:underline">claim your listing</a>{" "}
          today.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mb-3">What works today, no account needed</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {today.map(t => (
            <Card key={t.to} className="hover:border-blue-300 transition-colors">
              <CardContent className="p-4">
                <button type="button" onClick={() => navigate(t.to)} className="w-full text-left">
                  <t.icon className="size-5 text-blue-600 mb-2" />
                  <p className="font-medium text-gray-900">{t.title}</p>
                  <p className="text-sm text-gray-600">{t.text}</p>
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button className="mt-8 bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/prices")}>
          Compare prices
        </Button>
      </main>
    </div>
  );
}
