import { useState } from "react";
import { useNavigate } from "react-router";
import { OnboardingLayout } from "../components/OnboardingLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { User, Mail, Phone, Lock, MapPin, CreditCard, UserPlus, ArrowRight, ArrowLeft, Heart, Search, ShieldCheck, FileText, CheckCircle, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LegalDocumentModal } from "../components/LegalDocumentModal";
import { TermsContent } from "../components/legal/TermsContent";
import { PrivacyContent } from "../components/legal/PrivacyContent";
import { HipaaContent } from "../components/legal/HipaaContent";

export function Landing() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    zipCode: "",
    insuranceProvider: "",
    primaryGoal: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedHipaa, setAcceptedHipaa] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  
  // Track which documents have been scrolled to bottom
  const [scrolledTerms, setScrolledTerms] = useState(false);
  const [scrolledPrivacy, setScrolledPrivacy] = useState(false);
  const [scrolledHipaa, setScrolledHipaa] = useState(false);
  
  // Track which modal is open
  const [openModal, setOpenModal] = useState<"terms" | "privacy" | "hipaa" | null>(null);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.primaryGoal) {
      alert("Please select your primary healthcare goal");
      return;
    }
    setCurrentStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(4);
  };

  const handleStep4Continue = () => {
    setCurrentStep(5);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms || !acceptedHipaa || !acceptedPrivacy) {
      alert("Please read, review, and accept the Terms and Conditions, Privacy Policy, and HIPAA Privacy Notice to continue.");
      return;
    }
    // In a real app, this would create the account
    navigate("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={5}
      onBack={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(-1)}
    >
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Contextual Info */}
        <div className="hidden md:block">
          {currentStep === 1 && (
            <>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1666886573590-5815157da865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQyMjg1MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Healthcare professional"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="mt-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2">Why join Starkwell?</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Compare real prices from providers near you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>See CMS-backed quality and safety ratings for every facility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>HIPAA compliant and fully encrypted</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <Sparkles className="size-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900">Welcome to Starkwell!</h3>
              </div>
              <p className="text-gray-700 mb-6">
                We're here to make healthcare simpler. Let us know what you're looking for so we can personalize your experience.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                  <CheckCircle className="size-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Personalized recommendations</p>
                    <p className="text-sm text-gray-600">We'll show you relevant providers and services</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                  <CheckCircle className="size-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Faster search results</p>
                    <p className="text-sm text-gray-600">Skip the hassle and get right to what you need</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <MapPin className="size-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900">Almost there!</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Help us connect you with the right providers in your area.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="size-4 text-blue-600" />
                  <span>Find providers near you</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="size-4 text-blue-600" />
                  <span>See prices based on your insurance</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="size-4 text-blue-600" />
                  <span>Compare providers side-by-side before you choose</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwcGF0aWVudCUyMGNvbnN1bHRhdGlvbnxlbnwxfHx8fDE3NzQyMjg1MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Doctor consultation"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <CheckCircle className="size-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900">Final Step!</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Review and accept our policies to complete your account setup. We take your privacy and security seriously.
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
                  {currentStep === 1 && <UserPlus className="size-5 text-blue-600" />}
                  {currentStep === 2 && <Heart className="size-5 text-blue-600" />}
                  {currentStep === 3 && <MapPin className="size-5 text-blue-600" />}
                  {currentStep === 4 && <FileText className="size-5 text-blue-600" />}
                  {currentStep === 5 && <CheckCircle className="size-5 text-blue-600" />}
                </div>
                <CardTitle className="text-2xl text-blue-900">
                  {currentStep === 1 && "Create Account"}
                  {currentStep === 2 && "Your Healthcare Goals"}
                  {currentStep === 3 && "Profile Setup"}
                  {currentStep === 4 && "How Starkwell Works"}
                  {currentStep === 5 && "Review & Accept"}
                </CardTitle>
              </div>
              <CardDescription>
                {currentStep === 1 && "Get started with your secure healthcare account"}
                {currentStep === 2 && "Tell us what brings you to Starkwell"}
                {currentStep === 3 && "Help us personalize your experience"}
                {currentStep === 4 && "Learn the basics in under a minute"}
                {currentStep === 5 && "Accept our terms to complete signup"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-blue-900">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="pl-10 border-blue-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-blue-900">
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="pl-10 border-blue-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-blue-900">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10 border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-blue-900">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10 border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-blue-900">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="pl-10 border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
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

              {/* STEP 2: Goals & Welcome */}
              {currentStep === 2 && (
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-blue-900">
                      What's your primary healthcare goal?
                    </Label>
                    <RadioGroup value={formData.primaryGoal} onValueChange={(value) => setFormData({...formData, primaryGoal: value})}>
                      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                        <RadioGroupItem value="find-doctor" id="find-doctor" />
                        <Label htmlFor="find-doctor" className="cursor-pointer flex-1">
                          <p className="font-medium text-gray-900">Find a doctor or specialist</p>
                          <p className="text-sm text-gray-600">Search for providers by specialty and location</p>
                        </Label>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                        <RadioGroupItem value="compare-prices" id="compare-prices" />
                        <Label htmlFor="compare-prices" className="cursor-pointer flex-1">
                          <p className="font-medium text-gray-900">Compare prices for a procedure</p>
                          <p className="text-sm text-gray-600">See transparent pricing from multiple providers</p>
                        </Label>
                      </div>

                      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                        <RadioGroupItem value="book-appointment" id="book-appointment" />
                        <Label htmlFor="book-appointment" className="cursor-pointer flex-1">
                          <p className="font-medium text-gray-900">Book an appointment</p>
                          <p className="text-sm text-gray-600">Compare published prices before you go</p>
                        </Label>
                      </div>

                      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                        <RadioGroupItem value="elective-surgery" id="elective-surgery" />
                        <Label htmlFor="elective-surgery" className="cursor-pointer flex-1">
                          <p className="font-medium text-gray-900">Plan elective or cosmetic surgery</p>
                          <p className="text-sm text-gray-600">Research options and compare costs</p>
                        </Label>
                      </div>

                      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                        <RadioGroupItem value="general" id="general" />
                        <Label htmlFor="general" className="cursor-pointer flex-1">
                          <p className="font-medium text-gray-900">Just browsing</p>
                          <p className="text-sm text-gray-600">Exploring what Starkwell offers</p>
                        </Label>
                      </div>
                    </RadioGroup>
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
                      disabled={!formData.primaryGoal}
                    >
                      Continue
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </div>
                </form>
              )}

              {/* STEP 3: Profile Setup */}
              {currentStep === 3 && (
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-blue-900">
                      Zip Code
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="84101"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="pl-10 border-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500">We'll use this to find providers near you</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-blue-900">
                      Phone Number <span className="text-red-600">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(___) ___-____"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="pl-10 border-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      For appointment confirmations and account verification
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider" className="text-blue-900">
                      Insurance Provider <span className="text-gray-500">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        id="insuranceProvider"
                        name="insuranceProvider"
                        placeholder="e.g., Blue Cross, United Healthcare"
                        value={formData.insuranceProvider}
                        onChange={handleChange}
                        className="pl-10 border-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Helps us show you accurate pricing
                    </p>
                  </div>

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

              {/* STEP 4: Product Walkthrough */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                        <Search className="size-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Search & Discover</h4>
                        <p className="text-sm text-gray-600">
                          Find doctors, specialists, and facilities by location, specialty, or procedure. Filter by price, ratings, and availability.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                        <FileText className="size-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Compare Real Prices</h4>
                        <p className="text-sm text-gray-600">
                          See transparent pricing for procedures and services. Compare costs across providers side-by-side. No hidden fees.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                        <ShieldCheck className="size-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Quality & Safety Data</h4>
                        <p className="text-sm text-gray-600">
                          See real CMS patient-experience and safety ratings before you choose a provider — not marketing, actual federal survey data.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                        <Sparkles className="size-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">AI-Powered Guidance</h4>
                        <p className="text-sm text-gray-600">
                          Get your medical results explained in plain language. Understand your care options without the confusion.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-lg text-white text-center">
                    <p className="text-sm mb-2">🎉 You're ready to get started!</p>
                    <p className="text-xs text-blue-100">Just one more step to complete your account</p>
                  </div>

                  <div className="flex gap-3">
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
                      type="button"
                      onClick={handleStep4Continue}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Continue
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 5: Legal & Completion */}
              {currentStep === 5 && (
                <form onSubmit={handleStep5Submit} className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                        disabled={!scrolledTerms}
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
                        disabled={!scrolledPrivacy}
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
                        disabled={!scrolledHipaa}
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
                      onClick={() => setCurrentStep(4)}
                      className="flex-1 border-blue-200 text-blue-900 hover:bg-blue-50"
                    >
                      <ArrowLeft className="mr-2 size-4" />
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={!acceptedTerms || !acceptedHipaa || !acceptedPrivacy}
                    >
                      Complete Signup
                      <CheckCircle className="ml-2 size-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed pt-2">
                    <span className="text-red-600">*</span>We collect your phone number for account verification. We'll never call you unsolicited.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

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
    </OnboardingLayout>
  );
}
