import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  User,
  Mail,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  Save,
  Shield,
  Lock,
  CreditCard,
  Smartphone,
  Globe,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import { EncryptionBadge } from "../components/PHIIndicator";
import { useUser } from "../contexts/UserContext";

/**
 * Account settings page — form scaffolding, so mostly brought in as-is.
 *
 * Two fabricated-data items were removed rather than carried over:
 *  - The email fields were pre-filled with a fake "john.doe@example.com" /
 *    "john.backup@example.com". They now start from the (also mock, see
 *    UserContext) local user record, which is empty until the user fills it
 *    in — no invented address is displayed as if it were real.
 *  - A "Visa ending in 4242" payment method card was hard-coded with no
 *    billing backend behind it. Replaced with an honest "no payment method
 *    on file" state.
 *
 * All the toggles/switches/passwords/2FA dialog are local component state
 * only — nothing here is wired to a real backend. The alert()-based "saved"
 * confirmations are unchanged UI scaffolding, consistent with how the rest
 * of this project's forms behave before a backend exists.
 */
export function Settings() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("account");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailSettings, setEmailSettings] = useState({
    primaryEmail: user?.email ?? "",
    recoveryEmail: "",
    emailVerified: false,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
    securityAlerts: true,
    billingUpdates: true,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: "30",
    loginAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "private",
    shareDataForResearch: false,
    allowCookies: true,
  });

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    alert("Password updated successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Email settings updated successfully!");
  };

  const handleEnable2FA = () => {
    setSecurity({ ...security, twoFactorEnabled: true });
    setShow2FADialog(false);
    alert("Two-factor authentication enabled!");
  };

  const handleDeleteAccount = () => {
    alert("Account deletion request submitted");
    setShowDeleteDialog(false);
  };

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
              <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => navigate("/notifications")}>
                <Bell className="size-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => navigate("/settings")}>
                <SettingsIcon className="size-4" />
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
                    <SettingsIcon className="mr-2 h-4 w-4" />
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

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
              <p className="text-sm md:text-base text-gray-600">Manage your account configuration and preferences</p>
            </div>
            <EncryptionBadge />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="size-5 text-blue-600" />
                  Email Settings
                </CardTitle>
                <CardDescription>Manage your email addresses and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="primaryEmail">Primary Email</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="primaryEmail"
                        type="email"
                        placeholder="you@example.com"
                        value={emailSettings.primaryEmail}
                        onChange={(e) => setEmailSettings({ ...emailSettings, primaryEmail: e.target.value })}
                        className="flex-1"
                      />
                      {emailSettings.emailVerified ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200 flex-shrink-0">
                          <CheckCircle className="size-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500 flex-shrink-0">
                          Not verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="recoveryEmail">Recovery Email</Label>
                    <Input
                      id="recoveryEmail"
                      type="email"
                      placeholder="backup@example.com"
                      value={emailSettings.recoveryEmail}
                      onChange={(e) => setEmailSettings({ ...emailSettings, recoveryEmail: e.target.value })}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Used for account recovery and important security alerts</p>
                  </div>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="size-4 mr-2" />
                    Save Email Settings
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="size-5 text-blue-600" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters with numbers and symbols</p>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="size-4 mr-2" />
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="size-5 text-blue-600" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">2FA Status</p>
                    <p className="text-sm text-gray-600">
                      {security.twoFactorEnabled ? "Enabled and active" : "Not enabled"}
                    </p>
                  </div>
                  {security.twoFactorEnabled ? (
                    <Button variant="outline" onClick={() => setSecurity({ ...security, twoFactorEnabled: false })}>
                      Disable 2FA
                    </Button>
                  ) : (
                    <Button onClick={() => setShow2FADialog(true)} className="bg-blue-600 hover:bg-blue-700">
                      Enable 2FA
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="size-5 text-blue-600" />
                  Login Alerts
                </CardTitle>
                <CardDescription>Get notified about new logins to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email alerts for new logins</p>
                    <p className="text-sm text-gray-600">Receive an email when someone logs into your account</p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="size-5 text-blue-600" />
                  Session Management
                </CardTitle>
                <CardDescription>Control how long you stay logged in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Auto-logout after inactivity (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                      className="w-32 mt-1"
                    />
                  </div>
                  <Button variant="outline" disabled>Log Out All Other Sessions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="size-5 text-blue-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["emailNotifications", "Email Notifications", "Receive updates via email"],
                  ["smsNotifications", "SMS Notifications", "Receive text message alerts"],
                  ["pushNotifications", "Push Notifications", "Receive browser push notifications"],
                  ["appointmentReminders", "Appointment Reminders", "Get reminders before appointments"],
                  ["securityAlerts", "Security Alerts", "Important security notifications"],
                  ["billingUpdates", "Billing Updates", "Payment and subscription notifications"],
                  ["marketingEmails", "Marketing Emails", "Receive promotional content"],
                ].map(([key, label, desc], i, arr) => (
                  <div key={key}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-600">{desc}</p>
                      </div>
                      <Switch
                        checked={(notifications as any)[key]}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
                      />
                    </div>
                    {i < arr.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5 text-blue-600" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-sm text-gray-600">Who can see your profile information</p>
                  </div>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="private">Private</option>
                    <option value="providers">Providers Only</option>
                    <option value="public">Public</option>
                  </select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Share Data for Research</p>
                    <p className="text-sm text-gray-600">Help improve healthcare through anonymized data</p>
                  </div>
                  <Switch
                    checked={privacy.shareDataForResearch}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, shareDataForResearch: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Allow Cookies</p>
                    <p className="text-sm text-gray-600">Enable cookies for better experience</p>
                  </div>
                  <Switch
                    checked={privacy.allowCookies}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, allowCookies: checked })}
                  />
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/privacy")}>
                    <Shield className="size-4 mr-2" />
                    View Privacy Policy
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/hipaa-privacy")}>
                    <Shield className="size-4 mr-2" />
                    View HIPAA Privacy Notice
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Globe className="size-4 mr-2" />
                    Download My Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="size-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Settings */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="size-5 text-blue-600" />
                  Payment Method
                </CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg mb-4">
                  <CreditCard className="size-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">No payment method on file</p>
                    <p className="text-sm text-gray-500">Add one to subscribe to a paid plan</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full" disabled>Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your past invoices and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-sm text-gray-600">No billing history yet.</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 2FA Setup Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan this QR code with your authenticator app
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-500">[QR Code Placeholder — 2FA is not connected to a real backend yet]</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FADialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEnable2FA} className="bg-blue-600 hover:bg-blue-700">
              Enable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete your account? All of your data will be permanently removed.
            </p>
            <Label htmlFor="confirmDelete">Type "DELETE" to confirm</Label>
            <Input id="confirmDelete" placeholder="DELETE" className="mt-1" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">
              Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
