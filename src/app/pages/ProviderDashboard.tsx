import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  User,
  Settings,
  Bell,
  LogOut,
  Calendar,
  Users,
  FileText,
  Search,
  Mail,
} from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import { PHIIndicator } from "../components/PHIIndicator";
import { ProviderListingsCard } from "../components/ProviderListingsCard";
import { AppointmentRequestsCard } from "../components/AppointmentRequestsCard";
import { getCurrentProviderAccount, logoutProviderAccount, type ProviderAccount } from "../../lib/starkwell";

/**
 * Provider-facing dashboard shell.
 *
 * The original design filled this with a fake schedule ("Dr. Sarah
 * Johnson", four invented appointments with named patients), a fake
 * "247 active patients" stat, fake pending tasks, and fake unread messages.
 * There is no scheduling/EHR backend in this project (src/lib/starkwell.ts
 * only exposes public pricing data), so every one of those sections below
 * is an honest empty state instead.
 *
 * Identity here comes from a real provider-account session (see
 * getCurrentProviderAccount in src/lib/starkwell.ts), not from the mock
 * UserContext the rest of the role-gated dashboards still use. No password
 * yet, by design — see the note above provider_accounts in
 * api/serving_api.py — so "signed in" currently just means this browser
 * holds a valid session token from signup; redirects to /provider-login,
 * not a login page, when there isn't one.
 */
export function ProviderDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [account, setAccount] = useState<ProviderAccount | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCurrentProviderAccount()
      .then((acct) => {
        if (cancelled) return;
        if (!acct) {
          navigate("/provider-login");
          return;
        }
        setAccount(acct);
        setCheckingAuth(false);
      })
      .catch(() => {
        if (!cancelled) navigate("/provider-login");
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleLogout = () => {
    void logoutProviderAccount();
    navigate("/");
  };

  if (checkingAuth || !account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
        Loading your dashboard…
      </div>
    );
  }

  const providerName = account.contact_name || account.practice_name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-2 md:px-4 py-2">
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt="Starkwell"
              className="h-9 md:h-12 cursor-pointer rounded-[5px]"
              onClick={() => navigate("/")}
            />
            <div className="flex items-center gap-2 md:gap-4">
              <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50">
                Provider Access
              </Badge>
              <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => navigate("/notifications")}>
                <Bell className="size-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => navigate("/settings")}>
                <Settings className="size-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <User className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>{providerName}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/audit-log")}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Activity Log</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome, {providerName}
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                {account.practice_name} · No scheduling or patient-record backend is connected yet.
              </p>
            </div>
          </div>
        </div>

        <PHIIndicator type="banner" />

        {/* Stats — honest zero/empty rather than invented figures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Appointments</p>
                  <p className="text-3xl font-bold text-gray-400">No data</p>
                </div>
                <Calendar className="size-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Patients</p>
                  <p className="text-3xl font-bold text-gray-400">No data</p>
                </div>
                <Users className="size-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Tasks</p>
                  <p className="text-3xl font-bold text-gray-400">No data</p>
                </div>
                <FileText className="size-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Messages</p>
                  <p className="text-3xl font-bold text-gray-400">No data</p>
                </div>
                <Mail className="size-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProviderListingsCard />

            <AppointmentRequestsCard />

            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="size-5 text-blue-600" />
                      Schedule
                    </CardTitle>
                    <CardDescription>No appointments to show</CardDescription>
                  </div>
                  <PHIIndicator type="badge" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-sm text-gray-600">
                  Appointment scheduling isn't connected to a backend yet.
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="size-5 text-gray-500" />
                      Pending Tasks
                    </CardTitle>
                    <CardDescription>Nothing to review</CardDescription>
                  </div>
                  <PHIIndicator type="badge" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-sm text-gray-600">
                  No pending tasks — this list will populate once a records backend exists.
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="size-5 text-blue-600" />
                  Patient Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled
                  />
                </div>
                <PHIIndicator type="banner" />
                <p className="text-xs text-gray-500 mt-2">
                  Search is disabled — no patient-record backend is connected.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
