import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Users, User, Stethoscope, Shield, Headphones } from "lucide-react";
import { useNavigate } from "react-router";

/**
 * Demo-only role switcher. There is no authentication backend in this
 * project — this simply navigates to the dashboard route for each role so
 * the different admin/provider/support layouts can be reviewed. It does not
 * change any real permission state (see UserContext, which also has no
 * backend behind it).
 */
export function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const roles = [
    {
      role: "patient",
      name: "Patient",
      description: "View own medical records, book appointments, manage insurance",
      icon: User,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      route: "/dashboard",
      canAccessPHI: true
    },
    {
      role: "provider",
      name: "Provider / Doctor",
      description: "Access patient records, manage appointments, review results",
      icon: Stethoscope,
      color: "bg-green-100 text-green-700 border-green-200",
      route: "/provider-dashboard",
      canAccessPHI: true
    },
    {
      role: "admin",
      name: "Administrator",
      description: "Full system access, HIPAA compliance, audit logs, user management",
      icon: Shield,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      route: "/admin",
      canAccessPHI: true
    },
    {
      role: "support",
      name: "Support Staff",
      description: "Help with technical issues, billing, account access (NO PHI ACCESS)",
      icon: Headphones,
      color: "bg-orange-100 text-orange-700 border-orange-200",
      route: "/support-dashboard",
      canAccessPHI: false
    }
  ];

  const handleRoleSelect = (route: string) => {
    setOpen(false);
    navigate(route);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="size-4" />
          Switch Role (Demo)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Switch User Role (Demo Mode)</DialogTitle>
          <DialogDescription>
            Select a role to view the corresponding dashboard and access permissions.
            This is a client-side demo — no real authentication is wired up yet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {roles.map((roleData) => {
            const Icon = roleData.icon;
            return (
              <Card
                key={roleData.role}
                className={`cursor-pointer hover:shadow-md transition-all border-2 ${
                  roleData.canAccessPHI ? 'hover:border-blue-300' : 'hover:border-orange-300'
                }`}
                onClick={() => handleRoleSelect(roleData.route)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="size-5" />
                      {roleData.name}
                    </div>
                    <div className="flex items-center gap-2">
                      {roleData.canAccessPHI ? (
                        <Badge variant="outline" className="border-blue-600 text-blue-600 text-xs">
                          PHI Access
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-red-600 text-red-600 text-xs">
                          No PHI Access
                        </Badge>
                      )}
                      <Badge className={roleData.color}>{roleData.role}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{roleData.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
