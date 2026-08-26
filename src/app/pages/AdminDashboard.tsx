import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
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
  Shield,
  Users,
  Activity,
  Lock,
  FileText,
  Database,
  Server,
} from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import { PHIIndicator, EncryptionBadge } from "../components/PHIIndicator";
import { RoleSwitcher } from "../components/RoleSwitcher";

/**
 * HIPAA compliance / admin dashboard shell.
 *
 * The original design filled every card with invented numbers: a 98%
 * compliance score, 3,456 "active users", 1,247 PHI access logs, named
 * people ("Dr. Sarah Johnson", "John Doe") appearing in a fake access feed,
 * a compliance checklist asserting AES-256/TLS 1.3 are "compliant" with no
 * system behind that claim, and fabricated security events.
 *
 * None of that is backed by anything in src/lib/starkwell.ts or any other
 * real data source in this project — there is no admin/compliance backend
 * yet. Rather than invent plausible-looking numbers, every metric below is
 * an explicit "no data yet" placeholder. The four roles (Patients,
 * Providers, Admins, Support Staff) are real product concepts from
 * src/app/types/user.ts; the counts next to them are not, so the counts are
 * gone.
 */
export function AdminDashboard() {
  const navigate = useNavigate();

  const roleDefinitions = [
    { role: 'Patients', canAccessPHI: true, color: 'bg-blue-100 text-blue-700' },
    { role: 'Providers', canAccessPHI: true, color: 'bg-green-100 text-green-700' },
    { role: 'Admins', canAccessPHI: true, color: 'bg-purple-100 text-purple-700' },
    { role: 'Support Staff', canAccessPHI: false, color: 'bg-orange-100 text-orange-700' },
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
              <Badge variant="outline" className="border-purple-600 text-purple-600 bg-purple-50">
                Admin Access
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
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/audit-log")}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Audit Log</span>
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
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">HIPAA Compliance Dashboard</h1>
              <p className="text-sm md:text-base text-gray-600">Monitor system compliance, security, and access controls</p>
            </div>
            <EncryptionBadge />
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-sm text-amber-900">
            No admin/compliance backend is connected yet. Every metric below is a placeholder
            until real audit and access data exists — nothing here is invented.
          </div>
        </div>

        {/* Overview cards — explicit "no data" state instead of numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Compliance Score</p>
                <Shield className="size-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-400 mb-1">No data</p>
              <p className="text-xs text-gray-500">Not connected</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Active Users</p>
                <Users className="size-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-400 mb-1">No data</p>
              <p className="text-xs text-gray-500">Not connected</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">PHI Access Logs</p>
                <Shield className="size-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-400 mb-1">No data</p>
              <p className="text-xs text-gray-500">Not connected</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Open Issues</p>
                <Activity className="size-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-400 mb-1">No data</p>
              <p className="text-xs text-gray-500">Not connected</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="access-control">Access Control</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Roles — structural, from types/user.ts; no counts, since none exist */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="size-5 text-blue-600" />
                    User Roles & Access
                  </CardTitle>
                  <CardDescription>Role-based access control (RBAC) — the four roles this app defines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roleDefinitions.map((r) => (
                    <div key={r.role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <Badge className={r.color}>{r.role}</Badge>
                      {r.canAccessPHI ? (
                        <Badge variant="outline" className="border-blue-600 text-blue-600 text-xs">
                          PHI Access
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-400 text-gray-600 text-xs">
                          No PHI Access
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent PHI Access — empty state, no fake feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="size-5 text-blue-600" />
                    Recent PHI Access
                  </CardTitle>
                  <CardDescription>Real-time monitoring of PHI data access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-sm text-gray-600">
                    No access events recorded yet — audit logging is not connected to a backend.
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/audit-log")}>
                    View Full Audit Log
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-700">
                  <Activity className="size-5" />
                  Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-sm text-gray-600">
                  No security events recorded yet.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Control Tab */}
          <TabsContent value="access-control">
            <Card>
              <CardHeader>
                <CardTitle>Access Control Configuration</CardTitle>
                <CardDescription>Manage role-based access control (RBAC) settings</CardDescription>
              </CardHeader>
              <CardContent>
                <PHIIndicator type="banner" />
                <div className="space-y-6 mt-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Role Permissions</h3>
                    <div className="space-y-3">
                      {roleDefinitions.map((role) => (
                        <div key={role.role} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={role.color}>{role.role}</Badge>
                            <Button variant="outline" size="sm" disabled>Edit Permissions</Button>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>• {role.canAccessPHI ? 'Can access PHI data' : 'Cannot access PHI data'}</p>
                            <p>• Minimum necessary rule enforced</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="size-5 text-gray-500" />
                    Encryption Status
                  </CardTitle>
                  <CardDescription>Not connected to a backend — nothing to report yet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <Database className="size-5 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">Data at Rest</p>
                    </div>
                    <span className="text-xs text-gray-500">No data</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <Server className="size-5 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">Data in Transit</p>
                    </div>
                    <span className="text-xs text-gray-500">No data</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5 text-blue-600" />
                    Audit Trail
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-gray-900 mb-2">Intended Design</p>
                    <div className="space-y-1 text-xs text-gray-700">
                      <p>• PHI access would be logged with timestamps</p>
                      <p>• User, action, and resource tracked</p>
                      <p>• Not implemented yet — no logging backend exists</p>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => navigate("/audit-log")}>
                    View Full Audit Log
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>HIPAA Compliance Checklist</CardTitle>
                <CardDescription>Security Rule & Privacy Rule requirements — status unverified, no backend to check against</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-sm text-gray-600">
                  This checklist will populate once real infrastructure exists to verify each item
                  against. Nothing is marked compliant here that hasn't actually been verified.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
