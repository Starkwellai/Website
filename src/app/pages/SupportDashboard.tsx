import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
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
  Users,
  MessageSquare,
  ShieldOff,
  HelpCircle,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import { RoleSwitcher } from "../components/RoleSwitcher";

/**
 * Support-staff dashboard shell.
 *
 * The original design filled this with four invented support tickets and
 * four invented stats (12 open tickets, 8 resolved today, 4.2 min avg
 * response, 3,456 active users). None of that exists — there is no
 * ticketing backend in this project — so the ticket list and stats are
 * honest empty states below.
 *
 * The HIPAA "no PHI access" restriction notice and the allowed/restricted
 * action lists ARE kept as-is: they describe a real product policy (support
 * staff cannot see PHI, per src/app/types/user.ts's role model and
 * UserContext.canAccessPHI), not fabricated data.
 */
export function SupportDashboard() {
  const navigate = useNavigate();

  const statsData = [
    { label: "Open Tickets", icon: MessageSquare, color: "text-gray-300" },
    { label: "Resolved Today", icon: CheckCircle, color: "text-gray-300" },
    { label: "Avg Response Time", icon: Clock, color: "text-gray-300" },
    { label: "Active Users", icon: Users, color: "text-gray-300" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-2 md:px-4 py-2">
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt="Starkwell"
              className="h-6 md:h-6 lg:h-16 cursor-pointer rounded-[5px]"
              onClick={() => navigate("/")}
            />
            <div className="flex items-center gap-2 md:gap-4">
              <RoleSwitcher />
              <Badge variant="outline" className="border-orange-600 text-orange-600 bg-orange-50">
                Support Staff
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
                  <DropdownMenuLabel>Support Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/audit-log")}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Activity Log</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/")}>
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Support Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Manage user support requests and general inquiries</p>
        </div>

        {/* HIPAA restriction notice — real product policy, kept as-is */}
        <div className="bg-red-50 border-l-4 border-red-600 p-3 md:p-4 mb-6">
          <div className="flex items-start gap-3">
            <ShieldOff className="size-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-1">HIPAA Restriction: No PHI Access</h4>
              <p className="text-sm text-red-800 mb-2">
                As a support staff member, you do NOT have access to Protected Health Information (PHI)
                including medical records, insurance details, diagnoses, prescriptions, or lab results.
              </p>
              <p className="text-sm text-red-800 font-semibold">
                You can ONLY assist with: Account access, billing questions, technical issues, and general platform navigation.
              </p>
            </div>
          </div>
        </div>

        {/* Stats — no ticketing backend, so no data rather than invented numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-400">No data</p>
                    </div>
                    <Icon className={`size-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="size-5 text-blue-600" />
                  Active Support Tickets
                </CardTitle>
                <CardDescription>Non-PHI support requests only</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-sm text-gray-600">
                  No support tickets yet — this project doesn't have a ticketing backend connected.
                </div>
              </CardContent>
            </Card>

            {/* Restricted actions — real policy statement, kept as-is */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldOff className="size-5 text-red-600" />
                  Restricted Actions
                </CardTitle>
                <CardDescription className="text-red-800">
                  The following actions are NOT available to support staff
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-white rounded border border-red-200">
                  <ShieldOff className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">View Patient Medical Records</p>
                    <p className="text-xs text-gray-600">PHI - Requires Provider or Admin access</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded border border-red-200">
                  <ShieldOff className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Access Insurance Information</p>
                    <p className="text-xs text-gray-600">PHI - Requires Provider or Admin access</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded border border-red-200">
                  <ShieldOff className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">View Lab Results or Diagnoses</p>
                    <p className="text-xs text-gray-600">PHI - Requires Provider or Admin access</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded border border-red-200">
                  <ShieldOff className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Modify Medical Information</p>
                    <p className="text-xs text-gray-600">PHI - Requires Provider or Admin access</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-green-600" />
                  You Can Help With
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  "Password resets",
                  "Account access issues",
                  "Billing questions",
                  "Subscription tier changes",
                  "Technical issues",
                  "General platform navigation",
                  "Appointment scheduling help",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 p-2 bg-white rounded">
                    <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" disabled>
                  <MessageSquare className="size-4 mr-2" />
                  Create New Ticket
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <HelpCircle className="size-4 mr-2" />
                  Knowledge Base
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Phone className="size-4 mr-2" />
                  Escalate to Supervisor
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Mail className="size-4 mr-2" />
                  Email Templates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
