import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

/**
 * Shown right after a real POST /api/provider-signup succeeds. This used to
 * describe a fully automated pipeline — "verifying your NPI, 1-2 hours",
 * "we've sent a verification email", "24-48 hours for provider licenses" —
 * none of which exists. There is no NPPES integration and no outbound email
 * service configured anywhere in this project (see api/serving_api.py), so
 * this says what's actually true instead: the account is real and already
 * usable, and a human on our team follows up manually.
 */
export function ProviderVerificationPending() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col">
      <header className="bg-white border-b border-blue-100">
        <div className="container mx-auto px-2 md:px-4 py-4">
          <img
            src={logo}
            alt="Starkwell"
            className="h-9 md:h-12 cursor-pointer rounded-[5px]"
            onClick={() => navigate("/")}
          />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <Card className="shadow-lg border-blue-100">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="size-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl text-blue-900">You're in</CardTitle>
              <CardDescription className="text-base">
                Your account is created and ready to use.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-900 text-lg mb-2">What happens next</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We're a small team, so there's no automated approval yet — a real person
                  reviews every new practice, confirms your NPI against the public NPPES
                  registry, and reaches out personally within 1-2 business days to help get
                  your listing set up.
                </p>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-blue-200">
                <Mail className="size-5 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700">
                  Questions in the meantime? Email{" "}
                  <a href="mailto:provider-support@starkwell.com" className="text-blue-600 hover:underline font-medium">
                    provider-support@starkwell.com
                  </a>
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={() => navigate("/provider-dashboard")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Go to your dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full border-blue-200 text-blue-900 hover:bg-blue-50"
                >
                  Return to home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
