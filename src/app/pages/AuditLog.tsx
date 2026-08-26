import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
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
  Calendar,
  Search,
  Filter,
  Download,
  Lock,
  Activity,
} from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import type { AuditLogEntry } from "../types/user";
import { EncryptionBadge } from "../components/PHIIndicator";

/**
 * Activity/audit log page.
 *
 * The original design shipped with six invented log rows — "John Doe viewed
 * insurance information", "Dr. Sarah Johnson accessed medical records", IP
 * addresses, user agents, all fabricated. There is no audit-logging backend
 * in this project, so `auditLogs` starts empty and the page renders its own
 * empty state rather than inventing activity that never happened.
 */
export function AuditLog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const auditLogs: AuditLogEntry[] = [];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchQuery === "" ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || log.resourceType === filterType;
    return matchesSearch && matchesFilter;
  });

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'PHI': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Profile': return 'bg-green-100 text-green-700 border-green-200';
      case 'Appointment': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Insurance': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Billing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'System': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTimestamp = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(date);

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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
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
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
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

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity & Audit Log</h1>
              <p className="text-gray-600">View your account activity and data access history</p>
            </div>
            <EncryptionBadge />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">HIPAA Compliance</h4>
                <p className="text-sm text-blue-800">
                  Once connected to a backend, all access to your Protected Health Information (PHI)
                  will be logged here in compliance with HIPAA regulations. No audit-logging backend
                  is wired up yet, so this list is currently empty rather than illustrative.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search activity..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[150px]">
                    <Filter className="size-4 mr-2" />
                    {filterType === "all" ? "All Types" : filterType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterType("all")}>All Types</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("PHI")}>PHI</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Appointment")}>Appointment</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Insurance")}>Insurance</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Billing")}>Billing</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("System")}>System</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" disabled>
                <Download className="size-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
                </div>
                <Activity className="size-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">PHI Accesses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {auditLogs.filter(log => log.resourceType === 'PHI').length}
                  </p>
                </div>
                <Shield className="size-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <Calendar className="size-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Logging Status</p>
                  <p className="text-sm font-semibold text-gray-500">Not connected</p>
                </div>
                <Lock className="size-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Showing {filteredLogs.length} of {auditLogs.length} entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="size-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No activity recorded yet.</p>
                <p className="text-sm text-gray-500 mt-1">
                  This project doesn't have an audit-logging backend connected yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <Shield className="size-5 text-blue-600 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{log.details}</p>
                          <p className="text-sm text-gray-600">{log.action} by {log.userName}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs border ${getResourceTypeColor(log.resourceType)}`}>
                          {log.resourceType}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatTimestamp(log.timestamp)}
                        </span>
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Data Retention Policy</p>
                <p>
                  Once audit logging is implemented, records will be retained for a minimum of
                  6 years as required by HIPAA regulations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
