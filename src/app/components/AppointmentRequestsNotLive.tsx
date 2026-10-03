import { CalendarClock } from "lucide-react";

/**
 * Shown wherever a visitor would otherwise get an "Request an appointment"
 * form. The feature is built (see requestAppointment() in lib/starkwell.ts)
 * but switched off on the server until claimed listings are verified and the
 * site is served over https — it collects a patient's name, contact details
 * and reason for a visit, and would deliver them to whoever claimed the
 * listing. The server refuses requests while it's off, so this note and the
 * server can't disagree: both follow the same setting.
 */
export function AppointmentRequestsNotLive() {
  return (
    <p className="flex items-start gap-2 text-sm text-gray-600">
      <CalendarClock className="size-4 text-teal-700 shrink-0 mt-0.5" />
      <span>
        <strong className="text-gray-800">Online appointment requests aren&rsquo;t live yet.</strong>{" "}
        It&rsquo;s something we plan to add. For now, please contact the practice directly to book.
      </span>
    </p>
  );
}
