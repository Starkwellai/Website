import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { SiteHeader } from "../components/SiteHeader";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <SiteHeader />

      {/* 404 Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Back to Home
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/prices")}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Compare Prices
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

