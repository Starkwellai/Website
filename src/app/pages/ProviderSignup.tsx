import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { User, Mail, Lock, Building2, ArrowRight, ArrowLeft, CheckCircle, Stethoscope, Plus, X } from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import { LegalDocumentModal } from "../components/LegalDocumentModal";
import { TermsContent } from "../components/legal/TermsContent";
import { PrivacyContent } from "../components/legal/PrivacyContent";
import { HipaaContent } from "../components/legal/HipaaContent";

/**
 * Multi-step clinic + provider registration form. Pure form scaffolding —
 * every field here is user-entered input, not published data, so it's
 * brought in close to as-is per the FORM INPUT bucket.
 *
 * One thing worth flagging: `verifyClinicNPI` below is a MOCK check (any
 * 10-digit string "verifies"). It does not call the real NPPES registry.
 * That's unchanged from the original design — a real NPPES integration is
 * separate backend work — but it's called out here so it isn't mistaken for
 * a working verification.
 */

// US States list - used for both clinic and provider license state selectors
const US_STATES = [
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "IL", label: "Illinois" },
  { value: "PA", label: "Pennsylvania" },
  { value: "OH", label: "Ohio" },
  { value: "GA", label: "Georgia" },
  { value: "NC", label: "North Carolina" },
  { value: "MI", label: "Michigan" },
  { value: "NJ", label: "New Jersey" },
  { value: "VA", label: "Virginia" },
  { value: "AZ", label: "Arizona" },
  { value: "MA", label: "Massachusetts" },
  { value: "IN", label: "Indiana" },
  { value: "TN", label: "Tennessee" },
  { value: "MO", label: "Missouri" },
  { value: "MD", label: "Maryland" },
  { value: "WI", label: "Wisconsin" },
  { value: "CO", label: "Colorado" },
  { value: "MN", label: "Minnesota" },
  { value: "AL", label: "Alabama" },
  { value: "SC", label: "South Carolina" },
  { value: "KY", label: "Kentucky" },
  { value: "OR", label: "Oregon" },
  { value: "OK", label: "Oklahoma" },
  { value: "CT", label: "Connecticut" },
  { value: "UT", label: "Utah" },
  { value: "NE", label: "Nebraska" },
  { value: "IA", label: "Iowa" },
  { value: "MS", label: "Mississippi" },
  { value: "KS", label: "Kansas" },
  { value: "LA", label: "Louisiana" },
  { value: "NH", label: "New Hampshire" },
  { value: "WV", label: "West Virginia" },
  { value: "NM", label: "New Mexico" },
  { value: "RI", label: "Rhode Island" },
  { value: "DE", label: "Delaware" },
  { value: "SD", label: "South Dakota" },
  { value: "ND", label: "North Dakota" },
  { value: "MT", label: "Montana" },
  { value: "WY", label: "Wyoming" },
  { value: "AK", label: "Alaska" },
  { value: "HI", label: "Hawaii" },
  { value: "VT", label: "Vermont" },
  { value: "ME", label: "Maine" },
  { value: "ID", label: "Idaho" },
  { value: "AR", label: "Arkansas" },
  { value: "DC", label: "District of Columbia" },
];

interface Provider {
  id: string;
  name: string;
  npiNumber: string;
  licenseNumber: string;
  licenseState: string;
  providerType: string;
  specialty: string;
}

export function ProviderSignup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Clinic Information
    clinicName: "",
    clinicNpiType2: "",
    clinicAddress: "",
    clinicCity: "",
    clinicState: "",
    clinicZip: "",
    clinicPhone: "",
    clinicTaxId: "",

    // Step 2: Admin Account
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPassword: "",
    adminConfirmPassword: "",
    adminPhone: "",
    adminRole: "",
  });

  // Step 3: Providers list (optional)
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: "",
    npiNumber: "",
    licenseNumber: "",
    licenseState: "",
    providerType: "",
    specialty: "",
  });

  // Legal acceptance
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedHipaa, setAcceptedHipaa] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  // Track which documents have been scrolled to bottom
  const [scrolledTerms, setScrolledTerms] = useState(false);
  const [scrolledPrivacy, setScrolledPrivacy] = useState(false);
  const [scrolledHipaa, setScrolledHipaa] = useState(false);

  // Track which modal is open
  const [openModal, setOpenModal] = useState<"terms" | "privacy" | "hipaa" | null>(null);

  // Verification status
  const [npiVerificationStatus, setNpiVerificationStatus] = useState<"pending" | "verified" | "failed" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProvider({
      ...newProvider,
      [e.target.name]: e.target.value,
    });
  };

  const handleProviderSelectChange = (name: string, value: string) => {
    setNewProvider({
      ...newProvider,
      [name]: value,
    });
  };

  const addProvider = () => {
    if (newProvider.name && newProvider.npiNumber) {
      setProviders([
        ...providers,
        {
          id: Date.now().toString(),
          ...newProvider,
        },
      ]);
      setNewProvider({
        name: "",
        npiNumber: "",
        licenseNumber: "",
        licenseState: "",
        providerType: "",
        specialty: "",
      });
      setShowAddProvider(false);
    }
  };

  const removeProvider = (id: string) => {
    setProviders(providers.filter((p) => p.id !== id));
  };

  // Mock NPI verification
  const verifyClinicNPI = async (npi: string) => {
    // Simulate API call to NPPES
    setNpiVerificationStatus("pending");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock verification - in production, this would call NPPES API
    if (npi.length === 10) {
      setNpiVerificationStatus("verified");
      return true;
    } else {
      setNpiVerificationStatus("failed");
      return false;
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify clinic NPI
    const isValid = await verifyClinicNPI(formData.clinicNpiType2);
    if (isValid || formData.clinicNpiType2.length > 0) {
      setCurrentStep(2);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(4);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to verification pending page
    navigate("/provider-verification-pending");
  };

  const totalSteps = 4;
  const progressValue = (currentStep / totalSteps) * 100;

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

      {/* Progress Bar */}
      <div className="bg-white border-b border-blue-100">
        <div className="container mx-auto px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-600 font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-blue-600 font-medium">
                {progressValue.toFixed(0)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left side - Contextual Info */}
            <div className="hidden md:block">
              {currentStep === 1 && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-600 p-3 rounded-full">
                      <Building2 className="size-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-900">Register Your Clinic</h3>
                  </div>
                  <p className="text-gray-700 mb-6">
                    We'll verify your clinic's NPI and information through NPPES.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                      <span className="text-sm text-gray-600">Instant NPI verification</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                      <span className="text-sm text-gray-600">Secure clinic registration</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                      <span className="text-sm text-gray-600">HIPAA compliant platform</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-600 p-3 rounded-full">
                      <User className="size-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-900">Create Admin Account</h3>
                  </div>
                  <p className="text-gray-700 mb-6">
                    Set up the admin account for your clinic. This person will manage providers and settings.
                  </p>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                      <span>Full control over clinic settings</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                      <span>Add and manage providers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                      <span>Secure account access</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-600 p-3 rounded-full">
                      <User className="size-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-900">Add Providers</h3>
                  </div>
                  <p className="text-gray-700 mb-6">
                    Add healthcare providers to your clinic. This step is optional - you can add providers later.
                  </p>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                      <span>Each provider will be verified individually</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                      <span>You can skip and add providers later</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-600 p-3 rounded-full">
                      <CheckCircle className="size-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-900">Final Step!</h3>
                  </div>
                  <p className="text-gray-700 mb-6">
                    Review and accept our policies to complete your provider account setup.
                  </p>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                      <span>Your data is encrypted end-to-end</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                      <span>We never share your information without consent</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                      <span>100% HIPAA compliant platform</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Form Content */}
            <div>
              <Card className="shadow-lg border-blue-100">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      {currentStep === 1 && <Building2 className="size-5 text-blue-600" />}
                      {currentStep === 2 && <User className="size-5 text-blue-600" />}
                      {currentStep === 3 && <Stethoscope className="size-5 text-blue-600" />}
                      {currentStep === 4 && <CheckCircle className="size-5 text-blue-600" />}
                    </div>
                    <CardTitle className="text-2xl text-blue-900">
                      {currentStep === 1 && "Clinic Information"}
                      {currentStep === 2 && "Admin Account"}
                      {currentStep === 3 && "Add Providers"}
                      {currentStep === 4 && "Review & Accept"}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {currentStep === 1 && "Register your clinic or practice"}
                    {currentStep === 2 && "Create your admin account"}
                    {currentStep === 3 && "Add providers to your clinic (optional)"}
                    {currentStep === 4 && "Accept our terms to complete signup"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* STEP 1: Clinic Information */}
                  {currentStep === 1 && (
                    <form onSubmit={handleStep1Submit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="clinicName" className="text-blue-900">
                          Clinic Name
                        </Label>
                        <Input
                          id="clinicName"
                          name="clinicName"
                          placeholder="Downtown Medical Center"
                          value={formData.clinicName}
                          onChange={handleChange}
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clinicNpiType2" className="text-blue-900">
                          Clinic NPI Number (Type 2)
                        </Label>
                        <Input
                          id="clinicNpiType2"
                          name="clinicNpiType2"
                          placeholder="1234567890"
                          value={formData.clinicNpiType2}
                          onChange={handleChange}
                          maxLength={10}
                          className="border-blue-200 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500">Organizational NPI (10 digits) - will be verified through NPPES</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clinicAddress" className="text-blue-900">
                          Address
                        </Label>
                        <Input
                          id="clinicAddress"
                          name="clinicAddress"
                          placeholder="123 Main St"
                          value={formData.clinicAddress}
                          onChange={handleChange}
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clinicCity" className="text-blue-900">
                            City
                          </Label>
                          <Input
                            id="clinicCity"
                            name="clinicCity"
                            placeholder="Los Angeles"
                            value={formData.clinicCity}
                            onChange={handleChange}
                            className="border-blue-200 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="clinicState" className="text-blue-900">
                            State
                          </Label>
                          <Select
                            value={formData.clinicState}
                            onValueChange={(value) => handleSelectChange("clinicState", value)}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {US_STATES.map((state) => (
                                <SelectItem key={state.value} value={state.value}>
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clinicZip" className="text-blue-900">
                          Zip Code
                        </Label>
                        <Input
                          id="clinicZip"
                          name="clinicZip"
                          placeholder="90001"
                          value={formData.clinicZip}
                          onChange={handleChange}
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clinicPhone" className="text-blue-900">
                          Phone Number
                        </Label>
                        <Input
                          id="clinicPhone"
                          name="clinicPhone"
                          placeholder="(123) 456-7890"
                          value={formData.clinicPhone}
                          onChange={handleChange}
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clinicTaxId" className="text-blue-900">
                          Tax ID / EIN
                        </Label>
                        <Input
                          id="clinicTaxId"
                          name="clinicTaxId"
                          placeholder="12-3456789"
                          value={formData.clinicTaxId}
                          onChange={handleChange}
                          className="border-blue-200 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500">Employer Identification Number (EIN)</p>
                      </div>

                      <div className="pt-2">
                        <Button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Continue
                          <ArrowRight className="ml-2 size-4" />
                        </Button>
                      </div>

                      <p className="text-xs text-center text-gray-500">
                        Your information is encrypted and HIPAA compliant
                      </p>
                    </form>
                  )}

                  {/* STEP 2: Admin Account */}
                  {currentStep === 2 && (
                    <form onSubmit={handleStep2Submit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="adminFirstName" className="text-blue-900">
                            First Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            <Input
                              id="adminFirstName"
                              name="adminFirstName"
                              placeholder="John"
                              value={formData.adminFirstName}
                              onChange={handleChange}
                              className="pl-10 border-blue-200 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminLastName" className="text-blue-900">
                            Last Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            <Input
                              id="adminLastName"
                              name="adminLastName"
                              placeholder="Doe"
                              value={formData.adminLastName}
                              onChange={handleChange}
                              className="pl-10 border-blue-200 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adminEmail" className="text-blue-900">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                          <Input
                            id="adminEmail"
                            name="adminEmail"
                            type="email"
                            placeholder="dr.john.doe@example.com"
                            value={formData.adminEmail}
                            onChange={handleChange}
                            className="pl-10 border-blue-200 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adminPassword" className="text-blue-900">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                          <Input
                            id="adminPassword"
                            name="adminPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.adminPassword}
                            onChange={handleChange}
                            className="pl-10 border-blue-200 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adminConfirmPassword" className="text-blue-900">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                          <Input
                            id="adminConfirmPassword"
                            name="adminConfirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.adminConfirmPassword}
                            onChange={handleChange}
                            className="pl-10 border-blue-200 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adminPhone" className="text-blue-900">
                          Phone Number
                        </Label>
                        <Input
                          id="adminPhone"
                          name="adminPhone"
                          placeholder="(123) 456-7890"
                          value={formData.adminPhone}
                          onChange={handleChange}
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="adminRole" className="text-blue-900">
                          Role at Clinic
                        </Label>
                        <Select
                          value={formData.adminRole}
                          onValueChange={(value) => handleSelectChange("adminRole", value)}
                        >
                          <SelectTrigger className="border-blue-200">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="office-manager">Office Manager</SelectItem>
                            <SelectItem value="practice-administrator">Practice Administrator</SelectItem>
                            <SelectItem value="medical-director">Medical Director</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 border-blue-200 text-blue-900 hover:bg-blue-50"
                        >
                          <ArrowLeft className="mr-2 size-4" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Continue
                          <ArrowRight className="ml-2 size-4" />
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* STEP 3: Providers List (Optional) */}
                  {currentStep === 3 && (
                    <form onSubmit={handleStep3Submit} className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-sm text-gray-700">
                          You can add providers now or skip this step and add them later from your dashboard.
                        </p>
                      </div>

                      {/* Provider List */}
                      {providers.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-blue-900">Added Providers ({providers.length})</h4>
                          {providers.map((provider) => (
                            <div key={provider.id} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h5 className="font-semibold text-blue-900">{provider.name}</h5>
                                  <p className="text-sm text-gray-600">NPI: {provider.npiNumber}</p>
                                  <p className="text-sm text-gray-600">
                                    License: {provider.licenseNumber} ({provider.licenseState})
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {provider.providerType} {provider.specialty && `• ${provider.specialty}`}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeProvider(provider.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Provider Form */}
                      {showAddProvider ? (
                        <div className="bg-white p-4 rounded-lg border-2 border-blue-200 space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-blue-900">Add Provider</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowAddProvider(false)}
                              className="text-gray-600"
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        <div className="space-y-2">
                          <Label htmlFor="providerName" className="text-blue-900">
                            Provider Full Name
                          </Label>
                          <Input
                            id="providerName"
                            name="name"
                            placeholder="Dr. John Michael Doe"
                            value={newProvider.name}
                            onChange={handleProviderChange}
                            className="border-blue-200 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-500">Must match name on NPI registry</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="providerNpiNumber" className="text-blue-900">
                            Provider NPI Number (Type 1)
                          </Label>
                          <Input
                            id="providerNpiNumber"
                            name="npiNumber"
                            placeholder="1234567890"
                            value={newProvider.npiNumber}
                            onChange={handleProviderChange}
                            maxLength={10}
                            className="border-blue-200 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-500">Individual Provider NPI (10 digits) - will be verified through NPPES</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="providerLicenseNumber" className="text-blue-900">
                              License Number
                            </Label>
                            <Input
                              id="providerLicenseNumber"
                              name="licenseNumber"
                              placeholder="A123456"
                              value={newProvider.licenseNumber}
                              onChange={handleProviderChange}
                              className="border-blue-200 focus:border-blue-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="providerLicenseState" className="text-blue-900">
                              License State
                            </Label>
                            <Select
                              value={newProvider.licenseState}
                              onValueChange={(value) => handleProviderSelectChange("licenseState", value)}
                            >
                              <SelectTrigger className="border-blue-200">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {US_STATES.map((state) => (
                                  <SelectItem key={state.value} value={state.value}>
                                    {state.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="providerType" className="text-blue-900">
                              Provider Type
                            </Label>
                            <Select
                              value={newProvider.providerType}
                              onValueChange={(value) => handleProviderSelectChange("providerType", value)}
                            >
                              <SelectTrigger className="border-blue-200">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MD">MD (Doctor of Medicine)</SelectItem>
                                <SelectItem value="DO">DO (Doctor of Osteopathic Medicine)</SelectItem>
                                <SelectItem value="NP">NP (Nurse Practitioner)</SelectItem>
                                <SelectItem value="PA">PA (Physician Assistant)</SelectItem>
                                <SelectItem value="RN">RN (Registered Nurse)</SelectItem>
                                <SelectItem value="DDS">DDS (Doctor of Dental Surgery)</SelectItem>
                                <SelectItem value="DMD">DMD (Doctor of Dental Medicine)</SelectItem>
                                <SelectItem value="PharmD">PharmD (Doctor of Pharmacy)</SelectItem>
                                <SelectItem value="PT">PT (Physical Therapist)</SelectItem>
                                <SelectItem value="OT">OT (Occupational Therapist)</SelectItem>
                                <SelectItem value="DC">DC (Doctor of Chiropractic)</SelectItem>
                                <SelectItem value="PsyD">PsyD (Doctor of Psychology)</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="providerSpecialty" className="text-blue-900">
                              Specialty
                            </Label>
                            <Input
                              id="providerSpecialty"
                              name="specialty"
                              placeholder="Cardiology"
                              value={newProvider.specialty}
                              onChange={handleProviderChange}
                              className="border-blue-200 focus:border-blue-500"
                            />
                          </div>
                        </div>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={addProvider}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
                          >
                            <Plus className="mr-2 size-4" />
                            Add Provider
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddProvider(true)}
                          className="w-full border-blue-200 text-blue-900 hover:bg-blue-50"
                        >
                          <Plus className="mr-2 size-4" />
                          Add Your First Provider
                        </Button>
                      )}

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="flex-1 border-blue-200 text-blue-900 hover:bg-blue-50"
                        >
                          <ArrowLeft className="mr-2 size-4" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Continue
                          <ArrowRight className="ml-2 size-4" />
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* STEP 4: Legal & Completion */}
                  {currentStep === 4 && (
                    <form onSubmit={handleFinalSubmit} className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="terms"
                            checked={acceptedTerms}
                            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                          />
                          <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                            I have read and accept the{" "}
                            <button
                              type="button"
                              onClick={() => setOpenModal("terms")}
                              className="text-blue-600 hover:underline font-medium cursor-pointer"
                            >
                              Terms and Conditions
                            </button>
                            {!scrolledTerms && (
                              <span className="text-amber-600 text-xs block mt-1">
                                Click to read and scroll to bottom
                              </span>
                            )}
                          </Label>
                        </div>

                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="privacy"
                            checked={acceptedPrivacy}
                            onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                          />
                          <Label htmlFor="privacy" className="text-sm text-gray-700 leading-relaxed">
                            I have read and accept the{" "}
                            <button
                              type="button"
                              onClick={() => setOpenModal("privacy")}
                              className="text-blue-600 hover:underline font-medium cursor-pointer"
                            >
                              Privacy Policy
                            </button>
                            {!scrolledPrivacy && (
                              <span className="text-amber-600 text-xs block mt-1">
                                Click to read and scroll to bottom
                              </span>
                            )}
                          </Label>
                        </div>

                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="hipaa"
                            checked={acceptedHipaa}
                            onCheckedChange={(checked) => setAcceptedHipaa(checked === true)}
                          />
                          <Label htmlFor="hipaa" className="text-sm text-gray-700 leading-relaxed">
                            I acknowledge that I have received and reviewed the{" "}
                            <button
                              type="button"
                              onClick={() => setOpenModal("hipaa")}
                              className="text-blue-600 hover:underline font-medium cursor-pointer"
                            >
                              HIPAA Privacy Notice
                            </button>
                            {!scrolledHipaa && (
                              <span className="text-amber-600 text-xs block mt-1">
                                Click to read and scroll to bottom
                              </span>
                            )}
                          </Label>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(3)}
                          className="flex-1 border-blue-200 text-blue-900 hover:bg-blue-50"
                        >
                          <ArrowLeft className="mr-2 size-4" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Complete Signup
                          <CheckCircle className="ml-2 size-4" />
                        </Button>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed pt-2">
                        By completing signup, you confirm that all information provided is accurate and that you have the legal authority to practice medicine in the stated jurisdictions.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Legal Document Modals */}
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

      <LegalDocumentModal
        isOpen={openModal === "hipaa"}
        onClose={() => setOpenModal(null)}
        title="HIPAA Privacy Notice"
        content={<HipaaContent />}
        onScrolledToBottom={() => setScrolledHipaa(true)}
        hasScrolledToBottom={scrolledHipaa}
      />
    </div>
  );
}