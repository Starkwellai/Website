import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Clock, CheckCircle, Mail, Building2, Users } from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

/**
 * Static confirmation/informational page shown after ProviderSignup submits.
 * The timeline figures below ("1-2 hours", "24-48 hours") describe the
 * intended process, not a measurement of a real running system — no
 * fabricated counts or names appear here, so this page is carried over
 * close to as-is.
 */
export function ProviderVerificationPending() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-blue-100">
        <div className="container mx-auto px-2 md:px-4 py-4">
          <img
            src={logo}
            alt="Starkwell"
            className="h-6 md:h-6 lg:h-16 cursor-pointer rounded-[5px]"
            onClick={() => navigate("/")}
          />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <Card className="shadow-lg border-blue-100">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Clock className="size-12 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-3xl text-blue-900">
                Verification Pending
              </CardTitle>
              <CardDescription className="text-base">
                Thank you for registering your clinic with Starkwell! We're verifying your information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 space-y-4">
                <h3 className="font-semibold text-blue-900 text-lg">What Happens Next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 p-1.5 rounded-full mt-0.5">
                      <Building2 className="size-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">Clinic NPI Verification</p>
                      <p className="text-sm text-gray-600">
                        We'll verify your clinic's Type 2 NPI through the NPPES database. This usually takes 1-2 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 p-1.5 rounded-full mt-0.5">
                      <Users className="size-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">Provider Verification</p>
                      <p className="text-sm text-gray-600">
                        If you added providers, we'll verify their Type 1 NPIs and state licenses. This may take 24-48 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 p-1.5 rounded-full mt-0.5">
                      <Mail className="size-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">Email Confirmation</p>
                      <p className="text-sm text-gray-600">
                        We've sent a verification email to your admin email address. Please check your inbox and click the verification link.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 p-1.5 rounded-full mt-0.5">
                      <CheckCircle className="size-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">Approval Notification</p>
                      <p className="text-sm text-gray-600">
                        Once verified, you'll receive an email notification and can access your provider dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 text-lg mb-4">Expected Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email Verification</span>
                    <span className="text-sm text-blue-600 font-medium">Immediate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Clinic NPI Check</span>
                    <span className="text-sm text-blue-600 font-medium">1-2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Provider License Verification</span>
                    <span className="text-sm text-blue-600 font-medium">24-48 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Full Account Approval</span>
                    <span className="text-sm text-blue-600 font-medium">Up to 3 business days</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-900">
                  <strong>Important:</strong> Your account is currently in pending status. You'll receive an email once verification is complete. Please check your spam folder if you don't see our emails.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={() => navigate("/")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Return to Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/providers")}
                  className="w-full border-blue-200 text-blue-900 hover:bg-blue-50"
                >
                  Learn More About Provider Benefits
                </Button>
              </div>

              <div className="text-center pt-4 border-t border-blue-100">
                <p className="text-sm text-gray-600">
                  Questions about your verification status?{" "}
                  <a href="mailto:provider-support@starkwell.com" className="text-blue-600 hover:underline font-medium">
                    Contact Provider Support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
