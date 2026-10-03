import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Mail } from "lucide-react";
import {
  getAppointmentRequests, setAppointmentRequestStatus, type AppointmentRequest,
} from "../../lib/starkwell";

/** An inbox, not a booking system: once online appointment requests are
 *  switched on (they're off until claims are verified and the site is https —
 *  see APPOINTMENT_REQUESTS_ENABLED in api/serving_api.py), a patient who sees
 *  a claimed listing (see ProviderListingsCard.tsx) can send a request that
 *  lands here, and the provider follows up using the contact info the patient
 *  gave and marks it "Contacted". While it's off, this card says so rather
 *  than implying requests are arriving. */
export function AppointmentRequestsCard() {
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await getAppointmentRequests();
      setRequests(r.requests);
      setEnabled(r.enabled);
    } catch {
      // best effort — leave whatever was already there
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  async function toggleStatus(r: AppointmentRequest) {
    const next = r.status === "new" ? "contacted" : "new";
    setUpdatingId(r.id);
    try {
      await setAppointmentRequestStatus(r.id, next);
      setRequests(prev => prev.map(x => (x.id === r.id ? { ...x, status: next } : x)));
    } catch {
      // leave the row as-is on failure
    } finally {
      setUpdatingId(null);
    }
  }

  const newCount = requests.filter(r => r.status === "new").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2">
            <Mail className="size-5 text-purple-600" />
            Appointment Requests
          </CardTitle>
          {newCount > 0 && (
            <Badge className="bg-purple-600 hover:bg-purple-600">{newCount} new</Badge>
          )}
        </div>
        <CardDescription>
          {enabled
            ? "Patients who found you through a claimed listing and asked to be seen."
            : "Not live yet — patients can't send appointment requests through Starkwell today."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Loading requests…</p>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-600">
            {enabled
              ? "No requests yet. Claim your listing and add a description so patients know it's really you — requests will show up here."
              : "Online appointment requests are something we plan to add. Nothing will appear here until they launch, and we'll let you know when they do."}
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map(r => (
              <div key={r.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{r.patient_name}</p>
                      <Badge
                        variant="outline"
                        className={r.status === "new"
                          ? "border-purple-300 text-purple-700 bg-purple-50"
                          : "border-gray-300 text-gray-600 bg-gray-50"}
                      >
                        {r.status === "new" ? "New" : "Contacted"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{r.contact}</p>
                    <p className="text-xs text-gray-500">
                      {r.facility_label} · {r.address}, {r.city}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={updatingId === r.id}
                    onClick={() => toggleStatus(r)}
                  >
                    {r.status === "new" ? "Mark as contacted" : "Mark as new"}
                  </Button>
                </div>
                {r.message && <p className="text-sm text-gray-700 mt-1">{r.message}</p>}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
