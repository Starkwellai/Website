import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Building2, ArrowRight, AlertCircle } from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import { LegalDocumentModal } from "../components/LegalDocumentModal";
import { TermsContent } from "../components/legal/TermsContent";
import { PrivacyContent } from "../components/legal/PrivacyContent";
import { getCurrentProviderAccount, signupProviderAccount } from "../../lib/starkwell";

/**
 * Real account creation: this submits to POST /api/provider-signup and gets
 * back a real session token (see src/lib/starkwell.ts). It replaced a 4-step
 * wizard that looked identical but did nothing — no request was ever sent,
 * "NPI verification" accepted any 10-digit string, and the final step just
 * navigated away. That version also collected a password with nowhere to
 * check it against, which is worse than not asking at all.
 *
 * What's deliberately NOT here: NPI verification against NPPES (not built
 * yet, and the page says so) and an "email a verification link" step —
 * there is no outbound-email service configured yet (see api/serving_api.py),
 * so this doesn't pretend otherwise.
 */

const US_STATES = [
  { value: "UT", label: "Utah" }, { value: "CA", label: "California" }, { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" }, { value: "FL", label: "Florida" }, { value: "IL", label: "Illinois" },
  { value: "PA", label: "Pennsylvania" }, { value: "OH", label: "Ohio" }, { value: "GA", label: "Georgia" },
  { value: "NC", label: "North Carolina" }, { value: "MI", label: "Michigan" }, { value: "NJ", label: "New Jersey" },
  { value: "VA", label: "Virginia" }, { value: "AZ", label: "Arizona" }, { value: "MA", label: "Massachusetts" },
  { value: "CO", label: "Colorado" }, { value: "NV", label: "Nevada" }, { value: "ID", label: "Idaho" },
  { value: "WY", label: "Wyoming" }, { value: "OR", label: "Oregon" }, { value: "WA", label: "Washington" },
  { value: "Other", label: "Other" },
];

const SPECIALTIES = [
  "Primary care", "Cardiology", "Orthopedics", "Dermatology", "ENT", "OB/GYN", "Urology",
  "Gastroenterology", "Ophthalmology", "Physical therapy", "Imaging center", "Ambulatory surgery center",
  "Dental", "Behavioral health", "Other",
];

export function ProviderSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    practiceName: "",
    contactName: "",
    email: "",
    phone: "",
    npi: "",
    specialty: "",
    city: "",
    state: "",
    message: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [openModal, setOpenModal] = useState<"terms" | "privacy" | null>(null);
  const [scrolledTerms, setScrolledTerms] = useState(false);
  const [scrolledPrivacy, setScrolledPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If this browser already holds a valid session (signed up here before),
  // skip straight to the dashboard instead of showing an empty form that
  // would just fail with "account already exists" on submit.
  useEffect(() => {
    let cancelled = false;
    getCurrentProviderAccount().then((acct) => {
      if (!cancelled && acct) navigate("/provider-dashboard");
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("The two passwords don't match.");
      return;
    }
    if (!acceptedTerms || !acceptedPrivacy) {
      setError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }

    setSubmitting(true);
    try {
      await signupProviderAccount({
        practice_name: formData.practiceName,
        contact_name: formData.contactName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        npi: formData.npi || undefined,
        specialty: formData.specialty || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        message: formData.message || undefined,
      });
      navigate("/provider-verification-pending");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

      <main className="container mx-auto px-6 py-12 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <Building2 className="size-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900">Create your account</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Tell us about your practice. Your account works right away. Anything you claim stays private until we have reviewed it.
                </p>
              </div>
            </div>

            <div>
              <Card className="shadow-lg border-blue-100">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Building2 className="size-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl text-blue-900">Provider sign up</CardTitle>
                  </div>
                  <CardDescription>Create your Starkwell provider account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3">
                        <AlertCircle className="size-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="practiceName" className="text-blue-900">Practice or clinic name</Label>
                      <Input
                        id="practiceName" name="practiceName" placeholder="Downtown Medical Center"
                        value={formData.practiceName} onChange={handleChange} required
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName" className="text-blue-900">Your name</Label>
                        <Input
                          id="contactName" name="contactName" placeholder="Jane Smith"
                          value={formData.contactName} onChange={handleChange} required
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-blue-900">Phone</Label>
                        <Input
                          id="phone" name="phone" placeholder="(123) 456-7890"
                          value={formData.phone} onChange={handleChange}
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-900">Email address</Label>
                      <Input
                        id="email" name="email" type="email" placeholder="jane@downtownmedical.com"
                        value={formData.email} onChange={handleChange} required
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-blue-900">Password</Label>
                        <Input
                          id="password" name="password" type="password" autoComplete="new-password"
                          minLength={8} placeholder="At least 8 characters"
                          value={formData.password} onChange={handleChange} required
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-blue-900">Confirm password</Label>
                        <Input
                          id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
                          minLength={8}
                          value={formData.confirmPassword} onChange={handleChange} required
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-blue-900">City</Label>
                        <Input
                          id="city" name="city" placeholder="Salt Lake City"
                          value={formData.city} onChange={handleChange}
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-blue-900">State</Label>
                        <Select value={formData.state} onValueChange={(v) => handleSelectChange("state", v)}>
                          <SelectTrigger className="border-blue-200">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialty" className="text-blue-900">Specialty</Label>
                      <Select value={formData.specialty} onValueChange={(v) => handleSelectChange("specialty", v)}>
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {SPECIALTIES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="npi" className="text-blue-900">NPI number (optional)</Label>
                      <Input
                        id="npi" name="npi" placeholder="1234567890" maxLength={10}
                        value={formData.npi} onChange={handleChange}
                        className="border-blue-200 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500">
                        Optional. We don't check NPI numbers against the national registry yet; that's coming soon.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-blue-900">Anything we should know? (optional)</Label>
                      <Textarea
                        id="message" name="message" placeholder="What are you hoping to get out of Starkwell?"
                        value={formData.message} onChange={handleChange} maxLength={1000} rows={3}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="terms" checked={acceptedTerms}
                          onCheckedChange={(c) => setAcceptedTerms(c === true)}
                        />
                        <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                          I accept the{" "}
                          <button type="button" onClick={() => setOpenModal("terms")} className="text-blue-600 hover:underline font-medium">
                            Terms and Conditions
                          </button>
                        </Label>
                      </div>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="privacy" checked={acceptedPrivacy}
                          onCheckedChange={(c) => setAcceptedPrivacy(c === true)}
                        />
                        <Label htmlFor="privacy" className="text-sm text-gray-700 leading-relaxed">
                          I accept the{" "}
                          <button type="button" onClick={() => setOpenModal("privacy")} className="text-blue-600 hover:underline font-medium">
                            Privacy Policy
                          </button>
                        </Label>
                      </div>
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700">
                      {submitting ? "Creating account…" : "Create account"}
                      {!submitting && <ArrowRight className="ml-2 size-4" />}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      Already have an account?{" "}
                      <button type="button" onClick={() => navigate("/provider-login")} className="text-blue-600 hover:underline font-medium">
                        Log in
                      </button>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <LegalDocumentModal
        isOpen={openModal === "terms"}
        onClose={() => setOpenModal(null)}
        title="Terms and Conditions"
        content={<TermsContent />}
        onScrolledToBottom={() => setScrolledTerms(true)}
        hasScrolledToBottom={scrolledTerms}
      />
      <LegalDocumentModal
        isOpen={openModal === "privacy"}
        onClose={() => setOpenModal(null)}
        title="Privacy Policy"
        content={<PrivacyContent />}
        onScrolledToBottom={() => setScrolledPrivacy(true)}
        hasScrolledToBottom={scrolledPrivacy}
      />
    </div>
  );
}
