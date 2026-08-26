import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface PHIIndicatorProps {
  type?: 'badge' | 'banner' | 'inline';
  showEncrypted?: boolean;
}

/**
 * Visual "this is Protected Health Information" marker used across the
 * admin/provider/support pages. Purely presentational — it does not gate
 * access to anything; it labels sections that would carry PHI once a real
 * backend exists.
 */
export function PHIIndicator({ type = 'badge', showEncrypted = true }: PHIIndicatorProps) {
  if (type === 'banner') {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
        <div className="flex items-start gap-3">
          <Shield className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">Protected Health Information (PHI)</h4>
            <p className="text-sm text-blue-800">
              This section contains sensitive health data protected under HIPAA regulations.
              {showEncrypted && " All data is encrypted in transit and at rest."}
            </p>
          </div>
          {showEncrypted && (
            <Lock className="size-5 text-green-600 flex-shrink-0" />
          )}
        </div>
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-blue-600">
        <Shield className="size-3" />
        PHI
      </span>
    );
  }

  return (
    <Badge variant="outline" className="border-blue-600 text-blue-600 bg-blue-50">
      <Shield className="size-3 mr-1" />
      PHI Protected
    </Badge>
  );
}

interface MaskedDataProps {
  data: string;
  maskType?: 'full' | 'partial' | 'last4';
  canUnmask?: boolean;
  label?: string;
}

export function MaskedData({ data, maskType = 'partial', canUnmask = true, label }: MaskedDataProps) {
  const [isUnmasked, setIsUnmasked] = useState(false);

  const getMaskedValue = () => {
    if (isUnmasked) return data;

    switch (maskType) {
      case 'full':
        return '•'.repeat(data.length);
      case 'last4':
        return '•'.repeat(Math.max(0, data.length - 4)) + data.slice(-4);
      case 'partial':
      default:
        const visibleChars = Math.ceil(data.length * 0.3);
        return data.slice(0, visibleChars) + '•'.repeat(data.length - visibleChars);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-gray-700">{getMaskedValue()}</span>
      {canUnmask && (
        <button
          onClick={() => setIsUnmasked(!isUnmasked)}
          className="text-blue-600 hover:text-blue-700 p-1"
          aria-label={isUnmasked ? "Hide data" : "Show data"}
        >
          {isUnmasked ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      )}
      {label && <PHIIndicator type="inline" />}
    </div>
  );
}

export function EncryptionBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200">
      <Lock className="size-3" />
      <span>Encrypted & Secure</span>
    </div>
  );
}
