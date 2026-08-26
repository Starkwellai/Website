import { useNavigate } from "react-router";
import { CheckCircle2, Home } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

export function Success() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col items-center justify-center p-6">
      <img
        src={logo}
        alt="Starkwell"
        className="h-16 mb-6 cursor-pointer rounded-[5px]"
        onClick={() => navigate("/")}
      />
      <Card className="max-w-lg w-full shadow-xl border-blue-100">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="size-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-semibold text-blue-900 mb-3">
            Welcome to Starkwell!
          </h1>

          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Your account has been successfully created and your documents have been securely uploaded.
            You can now access your Starkwell dashboard.
          </p>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">1.</span>
                <span>Check your email for a verification link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">2.</span>
                <span>Complete your health profile in the dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">3.</span>
                <span>Schedule your first appointment (optional)</span>
              </li>
            </ul>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 w-full"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="size-4 mr-2" />
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
