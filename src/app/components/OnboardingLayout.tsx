import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

export function OnboardingLayout({ children, currentStep, totalSteps, onBack }: OnboardingLayoutProps) {
  const navigate = useNavigate();
  // Calculate progress percentage based on current step
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-blue-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
              <img 
                src={logo} 
                alt="Starkwell" 
                className="h-20 cursor-pointer rounded-[5px]"
                onClick={() => navigate("/")}
              />
            </div>
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          </div>
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
            <Progress value={progressValue} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-center text-sm text-gray-500">
              Â© 2026 Starkwell. Your information is secure and HIPAA compliant.
            </p>
            <div className="flex gap-4 text-sm">
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy</a>
              <a href="/terms" className="text-blue-600 hover:underline">Terms</a>
              <a href="/hipaa-privacy" className="text-blue-600 hover:underline">HIPAA</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
