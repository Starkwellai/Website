import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { UserCog } from "lucide-react";
import { updateMyAccount, changeMyPassword, type ProviderAccount } from "../../lib/starkwell";

/**
 * The account behind the dashboard: who the contact is, a phone number, and the password.
 * The email address is shown but not editable, because there is no way yet to confirm that a
 * new address belongs to the practice. The practice name here is for Starkwell's records; the
 * name patients see is the location name that was approved with the claim.
 */
export function ProviderAccountCard({ account, onChanged }: { account: ProviderAccount; onChanged: () => void }) {
  const [practiceName, setPracticeName] = useState(account.practice_name);
  const [contactName, setContactName] = useState(account.contact_name);
  const [phone, setPhone] = useState(account.phone ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true); setProfileMsg(null);
    try {
      await updateMyAccount({ practice_name: practiceName, contact_name: contactName, phone });
      setProfileMsg({ ok: true, text: "Saved." });
      onChanged();
    } catch (err) {
      setProfileMsg({ ok: false, text: err instanceof Error ? err.message : "Couldn't save — try again." });
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (next.length < 8) { setPwMsg({ ok: false, text: "Choose a new password with at least 8 characters." }); return; }
    if (next !== confirm) { setPwMsg({ ok: false, text: "The two new passwords don't match." }); return; }
    setSavingPw(true);
    try {
      await changeMyPassword(current, next);
      setCurrent(""); setNext(""); setConfirm("");
      setPwMsg({ ok: true, text: "Password changed. Any other devices were signed out." });
    } catch (err) {
      setPwMsg({ ok: false, text: err instanceof Error ? err.message : "Couldn't change the password — try again." });
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="size-5 text-gray-600" />
          Your account
        </CardTitle>
        <CardDescription>Signed in as {account.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={saveProfile} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="acct-practice">Practice name</Label>
            <Input id="acct-practice" value={practiceName} onChange={e => setPracticeName(e.target.value)} maxLength={200} required />
            <p className="text-xs text-gray-500">For our records. Patients see the location name you gave when you claimed it.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="acct-contact">Your name</Label>
            <Input id="acct-contact" value={contactName} onChange={e => setContactName(e.target.value)} maxLength={120} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="acct-phone">Phone</Label>
            <Input id="acct-phone" value={phone} onChange={e => setPhone(e.target.value)} maxLength={40} placeholder="(801) 555-0100" />
            <p className="text-xs text-gray-500">Shown on a location unless you give that location its own phone number.</p>
          </div>
          {profileMsg && <p role={profileMsg.ok ? "status" : "alert"} className={`text-sm ${profileMsg.ok ? "text-green-700" : "text-red-700"}`}>{profileMsg.text}</p>}
          <Button type="submit" size="sm" disabled={savingProfile} className="bg-blue-600 hover:bg-blue-700">
            {savingProfile ? "Saving…" : "Save changes"}
          </Button>
        </form>

        <form onSubmit={savePassword} className="space-y-3 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-900">Change password</p>
          <Input type="password" autoComplete="current-password" placeholder="Current password" value={current} onChange={e => setCurrent(e.target.value)} required />
          <Input type="password" autoComplete="new-password" placeholder="New password (8+ characters)" value={next} onChange={e => setNext(e.target.value)} minLength={8} required />
          <Input type="password" autoComplete="new-password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} minLength={8} required />
          {pwMsg && <p role={pwMsg.ok ? "status" : "alert"} className={`text-sm ${pwMsg.ok ? "text-green-700" : "text-red-700"}`}>{pwMsg.text}</p>}
          <Button type="submit" size="sm" variant="outline" disabled={savingPw || !current || !next || !confirm}>
            {savingPw ? "Changing…" : "Change password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
