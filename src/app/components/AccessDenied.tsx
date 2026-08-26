import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ShieldOff, AlertTriangle, ArrowLeft, FileText } from "lucide-react";

interface AccessDeniedProps {
  userRole?: string;
  requiredRole?: string;
  resourceType?: string;
}

/**
 * Shown when the (mock, client-side only — see UserContext) role state
 * doesn't permit a route. There is no real backend enforcing this; it is a
 * UI-level illustration of what role-gating should look like once auth
 * exists.
 */
export function AccessDenied({
  userRole = "support",
  requiredRole = "provider or admin",
  resourceType = "Protected Health Information (PHI)"
}: AccessDeniedProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full border-red-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <ShieldOff className="size-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-red-900">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border-l-4 border-red-600 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Insufficient Permissions</h4>
                <p className="text-sm text-red-800">
                  You do not have permission to access <strong>{resourceType}</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">HIPAA Compliance Notice</h4>
            <p className="text-sm text-blue-800 mb-3">
              Under HIPAA regulations, access to Protected Health Information (PHI) is restricted
              based on the "minimum necessary" rule. Only authorized personnel with a legitimate
              need-to-know may access patient health data.
            </p>
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>Your current role:</strong> {userRole.toUpperCase()}</p>
              <p><strong>Required role:</strong> {requiredRole.toUpperCase()}</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">What you can do:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>If you believe you should have access, contact your system administrator to request permission changes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>This access attempt has been logged for security and compliance purposes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Unauthorized attempts to access PHI may result in disciplinary action</span>
              </li>
            </ul>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-4">
            <div className="flex items-start gap-3">
              <FileText className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-orange-900 mb-1">Access Attempt Logged</h4>
                <p className="text-sm text-orange-800">
                  This access attempt has been recorded in the audit trail with your user ID,
                  timestamp, IP address, and requested resource. All access logs are reviewed
                  regularly for HIPAA compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="size-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
