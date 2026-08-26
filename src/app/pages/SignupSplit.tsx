import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { User, Mail, Lock, ArrowRight, Search, Calendar, TrendingUp, Shield } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

export function SignupSplit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedHealthConsent, setAcceptedHealthConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporarily disabled validation for faster testing
    navigate("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <img 
            src={logo} 
            alt="Starkwell" 
            className="h-20 cursor-pointer rounded-[5px]"
            onClick={() => navigate("/")}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Get started with Starkwell today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="pt-2 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="healthConsent"
                    checked={acceptedHealthConsent}
                    onCheckedChange={(checked) => setAcceptedHealthConsent(checked === true)}
                    className="mt-0.5 shrink-0"
                  />
                  <label htmlFor="healthConsent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    I consent to Starkwell collecting data, including sensitive information such as health data, and I have the right to{" "}
                    <a 
                      href="#" 
                      className="text-blue-600 hover:underline font-medium inline" 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      revoke consent
                    </a>
                    . I acknowledge I have received the{" "}
                    <a 
                      href="/hipaa-privacy" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline font-medium inline whitespace-nowrap" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      HIPAA Privacy Notice
                    </a>
                    .
                  </label>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                    className="mt-0.5 shrink-0"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    I have read and accept Starkwell's{" "}
                    <a 
                      href="/terms" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline font-medium inline whitespace-nowrap" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms of Use
                    </a>
                    {" "}and{" "}
                    <a 
                      href="/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline font-medium inline whitespace-nowrap" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-11"
            >
              Create Account
              <ArrowRight className="ml-2 size-4" />
            </Button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}