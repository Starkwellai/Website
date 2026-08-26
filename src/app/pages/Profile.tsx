import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
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
  Mail,
  Phone,
  MapPin,
  Bell,
  Settings,
  LogOut,
  Save,
  Shield,
  Crown,
  Edit2,
  FileText,
} from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import { PHIIndicator, MaskedData, EncryptionBadge } from "../components/PHIIndicator";
import { useUser } from "../contexts/UserContext";

/**
 * Account profile page.
 *
 * All fields here are user-entered form input, not published data, so the
 * FORM INPUT rules apply: it's fine to bring this in as editable scaffolding.
 * Two things from the original design were removed rather than carried over:
 *
 *  - A stock Unsplash headshot as the default profile photo. Nothing backs
 *    that image being "this user" — replaced with an initials avatar that is
 *    honest about being a placeholder until a real photo is uploaded.
 *  - A "profileStats" row (12 appointments / 3 providers / 8 saved). Those
 *    numbers had no source anywhere in this codebase — this project has zero
 *    tolerance for invented counts, so the row is gone rather than filled
 *    with plausible-looking numbers.
 *
 * Insurance and subscription fields start empty/at the free tier rather than
 * pre-filled with a fake insurer or a fake paid plan, since no billing or
 * insurance backend exists to back either claim.
 */
export function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    location: user?.location ?? "",
    dateOfBirth: "",
    bio: "",
  });

  const [insuranceData, setInsuranceData] = useState({
    provider: "",
    memberId: "",
    groupNumber: "",
  });

  // No subscription backend exists yet — default to the actual free tier
  // rather than implying the demo account already paid for something.
  const [currentTier] = useState("Free");

  const initials = (
    (profileData.firstName?.[0] ?? "") + (profileData.lastName?.[0] ?? "")
  ).toUpperCase() || "?";

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(user ? {
      ...user,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
    } : user);
    setIsEditing(false);
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

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-sm md:text-base text-gray-600">View and manage your public profile information</p>
            </div>
            <div className="flex items-center gap-2">
              <EncryptionBadge />
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className={!isEditing ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <Edit2 className="size-4 mr-2" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <div
                      className="w-32 h-32 rounded-full border-4 border-gray-100 bg-blue-100 text-blue-700 flex items-center justify-center text-4xl font-semibold"
                      aria-label="Profile photo placeholder"
                    >
                      {initials}
                    </div>
                    {isEditing && (
                      <Button variant="outline" size="sm" className="mt-3" disabled>
                        Upload Photo
                      </Button>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {profileData.firstName || profileData.lastName
                            ? `${profileData.firstName} ${profileData.lastName}`.trim()
                            : "Add your name"}
                        </h2>
                        <p className="text-gray-600">{profileData.email || "No email on file"}</p>
                      </div>
                      <Badge className="bg-blue-600 text-white">
                        <Crown className="size-3 mr-1" />
                        {currentTier}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="size-5 text-blue-600" />
                  Basic Information
                </CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  {isEditing && (
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Save className="size-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Insurance Information */}
            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="size-5 text-blue-600" />
                      Insurance Information
                    </CardTitle>
                    <CardDescription>Your health insurance details</CardDescription>
                  </div>
                  <PHIIndicator type="badge" />
                </div>
              </CardHeader>
              <CardContent>
                <PHIIndicator type="banner" />
                {insuranceData.provider || insuranceData.memberId || insuranceData.groupNumber ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Insurance Provider</Label>
                      <p className="text-gray-900 font-medium mt-1">{insuranceData.provider || "—"}</p>
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        Member ID <PHIIndicator type="inline" />
                      </Label>
                      <MaskedData data={insuranceData.memberId} maskType="partial" canUnmask label="PHI" />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        Group Number <PHIIndicator type="inline" />
                      </Label>
                      <MaskedData data={insuranceData.groupNumber} maskType="partial" canUnmask label="PHI" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-sm text-gray-600">
                    No insurance information on file yet.
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/settings")}>
                  <Settings className="size-4 mr-2" />
                  Manage Insurance
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="size-5 text-blue-600" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Crown className="size-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">{currentTier} Plan</h3>
                  <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/subscription-tiers")}>
                    View Plans
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate("/settings")}>
                  <Settings className="size-4 mr-2" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate("/audit-log")}>
                  <FileText className="size-4 mr-2" />
                  Activity Log
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate("/hipaa-privacy")}>
                  <Shield className="size-4 mr-2" />
                  HIPAA Privacy Notice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
