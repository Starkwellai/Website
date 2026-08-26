import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Database } from "lucide-react";

/**
 * The original DatabaseScan.tsx called a Supabase Edge Function
 * (`/functions/v1/make-server-d4c04435/clinics/scan`) that doesn't exist in
 * this project — there is no Supabase backend here, only the local
 * `/serving` API described in src/lib/starkwell.ts. Firing that fetch on
 * every page load would just produce a console error, and printing whatever
 * came back with `JSON.stringify` would risk rendering fabricated-looking
 * data if a similarly-named endpoint ever existed elsewhere.
 *
 * Rather than wire this to a fake or non-existent endpoint, it's now a
 * static status page that says plainly there is nothing to scan yet. If a
 * real clinic-database inspection tool is needed later, it should call the
 * real `/serving` API (see getFacilities/searchServices in
 * src/lib/starkwell.ts) rather than a Supabase function that was never part
 * of this project's backend.
 */
export function DatabaseScan() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-6 text-blue-600" />
              Utah Clinics Database Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
              This tool isn't connected to a backend. The original design called a Supabase
              function that was never part of this project — this project's real data comes from
              the local pricing API described in <code>src/lib/starkwell.ts</code>. There is
              nothing to scan here yet.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
