import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Search, MapPin, Calendar, FileText, Heart, TrendingUp, Award, User, Settings, Bell, ChevronRight, Stethoscope, Activity, LogOut, X, CheckCircle, Circle, Phone, CreditCard, Zap, Crown } from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import { useEffect, useState } from "react";
import {
  searchServices, getProviders, formatPrice,
  SPECIALIST_CATEGORIES,
  type ProviderPrice,
} from "../../lib/starkwell";

export function Dashboard() {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    phone: "",
    location: "",
    insuranceProvider: "",
    insuranceMemberId: "",
  });

  // Mock user data - would come from auth/API in real app
  const userName = "John";
  
  // Onboarding checklist items
  const [onboardingItems, setOnboardingItems] = useState([
    { id: "phone", label: "Add phone number", completed: false, icon: Phone },
    { id: "location", label: "Set your location", completed: false, icon: MapPin },
    { id: "insurance", label: "Add insurance info", completed: false, icon: CreditCard },
    { id: "tier", label: "Choose subscription tier", completed: false, icon: Crown },
  ]);

  const completedCount = onboardingItems.filter(item => item.completed).length;
  const totalCount = onboardingItems.length;

  const handleOnboardingItemClick = (itemId: string) => {
    setActiveModal(itemId);
  };

  const markItemComplete = (itemId: string) => {
    setOnboardingItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, completed: true } : item
      )
    );
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile.phone.trim()) {
      markItemComplete("phone");
      setActiveModal(null);
    }
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile.location.trim()) {
      markItemComplete("location");
      setActiveModal(null);
    }
  };

  const handleInsuranceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile.insuranceProvider.trim() && userProfile.insuranceMemberId.trim()) {
      markItemComplete("insurance");
      setActiveModal(null);
    }
  };

  const handleTierSelect = (tier: string) => {
    setSelectedTier(tier);
    markItemComplete("tier");
    setActiveModal(null);
  };

  // Quick actions based on their onboarding goal
  const quickActions = [
    {
      icon: Search,
      title: "Find a Provider",
      description: "Search for doctors and specialists near you",
      action: "search",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: FileText,
      title: "Compare Prices",
      description: "See transparent pricing for procedures",
      action: "compare",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Calendar,
      title: "Find Care Near You",
      description: "See published rates near you",
      action: "nearby",
      color: "bg-green-100 text-green-600"
    },
  ];

  // Real lowest-priced providers for a common procedure, loaded from the
  // serving API. This replaces a mock array of invented doctors — "Dr. Sarah
  // Johnson", rating 4.8, 234 reviews, "Tomorrow at 2:00 PM", and an Unsplash
  // stock photograph of a real person presented as a Utah physician.
  //
  // Every one of those fields is unsourceable: we hold no ratings, no reviews,
  // no scheduling feed and no provider photography. They are not rendered here
  // at all rather than being stubbed, because a plausible placeholder is what
  // gets shipped by accident.
  const [lowest, setLowest] = useState<ProviderPrice[]>([]);
  const [lowestService, setLowestService] = useState<string>("");
  const [lowestError, setLowestError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const svcs = await searchServices("MRI knee", { limit: 1 });
        if (!svcs.length) return;
        const r = await getProviders(svcs[0].service_key, { limit: 3 });
        if (!cancelled) {
          setLowestService(r.display_name ?? svcs[0].display_name);
          setLowest(r.results);
        }
      } catch {
        if (!cancelled) setLowestError(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img 
              src={logo} 
              alt="Starkwell" 
              className="h-20 cursor-pointer rounded-[5px]"
              onClick={() => navigate("/")}
            />
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Bell className="size-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
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
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-gray-600">
            You're all set up and ready to find the care you need.{" "}
            <Button 
              variant="link" 
              className="text-blue-600 hover:text-blue-700 p-0 h-auto"
              onClick={() => navigate("/subscription-tiers")}
            >
              Learn more about subscription tiers
            </Button>
          </p>
        </div>

        {/* Onboarding Checklist Banner */}
        {showOnboarding && (
          <Card className="mb-8 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="size-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Get Started with Starkwell</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowOnboarding(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Complete your profile to unlock all features and get the most out of your healthcare experience.
              </p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">{completedCount} of {totalCount} completed</span>
                  <span className="font-medium text-blue-600">{Math.round((completedCount / totalCount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                {onboardingItems.map((item) => {
                  const Icon = item.icon;
                  const StatusIcon = item.completed ? CheckCircle : Circle;
                  return (
                    <div 
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all cursor-pointer group border border-gray-100"
                      onClick={() => handleOnboardingItemClick(item.id)}
                    >
                      <StatusIcon className={`size-5 flex-shrink-0 ${item.completed ? 'text-green-600' : 'text-gray-300'}`} />
                      <Icon className="size-4 text-gray-400 flex-shrink-0" />
                      <span className={`text-sm flex-1 ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700 group-hover:text-blue-600'}`}>
                        {item.label}
                      </span>
                      {!item.completed && (
                        <ChevronRight className="size-4 text-gray-300 group-hover:text-blue-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Bar */}
        <Card className="shadow-lg border-gray-200 mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for doctors, specialists, or procedures"
                  className="pl-10 h-12 border-gray-200"
                  id="main-search"
                />
              </div>
              <div className="relative md:w-64">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Location"
                  className="pl-10 h-12 border-gray-200"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Card
                      key={action.action}
                      onClick={() => navigate("/prices")}
                      className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200"
                    >
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                          <Icon className="size-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                        <Button variant="ghost" className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-700">
                          Get started <ChevronRight className="size-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Lowest published prices — real rows from the serving slice.
                Heading is NOT "Recommended for You": nothing here is personalised,
                because we hold no user location, history or preferences. Claiming
                a recommendation we cannot make is the same failure as inventing a
                rating. */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Lowest published prices{lowestService ? `: ${lowestService}` : ""}
                </h2>
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                  onClick={() => navigate("/prices")}
                >
                  Search all <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {lowest.map(p => (
                  <Card
                    key={`${p.npi}-${p.median_rate}`}
                    className="hover:shadow-lg transition-shadow border-gray-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {p.provider_name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <MapPin className="size-4 shrink-0" />
                            <span>{p.city ?? "—"}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Covered by {p.n_payers} {p.n_payers === 1 ? "plan" : "plans"}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => navigate("/prices")}
                            >
                              Compare prices
                            </Button>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-lg font-semibold text-gray-900">
                            {formatPrice(p.median_rate)}
                          </div>
                          {p.pct_of_medicare != null && (
                            <div className="text-xs text-gray-500">
                              {Math.round(p.pct_of_medicare)}% of Medicare
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {lowest.length === 0 && (
                  <Card className="border-gray-200">
                    <CardContent className="p-6 text-sm text-gray-600">
                      {lowestError
                        ? "Prices are unavailable right now."
                        : "Loading published prices…"}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Your Journey */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Your Healthcare Journey</CardTitle>
                <CardDescription>Track your progress and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-600 p-3 rounded-full">
                      <TrendingUp className="size-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Complete your first search</p>
                      <p className="text-sm text-gray-600">Find providers and compare options</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate("/prices")}
                    >
                      Start
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Stats */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Search className="size-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Searches</span>
                  </div>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="size-5 text-green-600" />
                    <span className="text-sm text-gray-700">Appointments</span>
                  </div>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="size-5 text-red-600" />
                    <span className="text-sm text-gray-700">Saved Providers</span>
                  </div>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
              </CardContent>
            </Card>

            {/* Popular Categories */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Browse by specialty</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate(`/prices?category=${encodeURIComponent("Primary care")}`)}
                >
                  <Stethoscope className="size-4 mr-2" />
                  Primary Care
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate(`/prices?categories=${encodeURIComponent(SPECIALIST_CATEGORIES.join(","))}`)}
                >
                  <Activity className="size-4 mr-2" />
                  Specialists
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate(`/prices?category=${encodeURIComponent("Urgent care")}`)}
                >
                  <Heart className="size-4 mr-2" />
                  Urgent Care
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate("/prices")}
                >
                  View all categories <ChevronRight className="size-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is here to assist you with any questions.
                </p>
                {/* No support/contact page exists yet — same gap as the
                    site nav's "Help" link. Disabled rather than a silent
                    dead click. */}
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  disabled
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === "phone" && (
        <Dialog open={activeModal === "phone"} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Phone Number</DialogTitle>
              <DialogDescription>Your phone number is only used for confirming appointments and for Doctors reaching out.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePhoneSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123-456-7890"
                    className="col-span-3"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {activeModal === "location" && (
        <Dialog open={activeModal === "location"} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set Your Location</DialogTitle>
              <DialogDescription>Enter your location to find providers near you.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLocationSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="City, State"
                    className="col-span-3"
                    value={userProfile.location}
                    onChange={(e) => setUserProfile({ ...userProfile, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {activeModal === "insurance" && (
        <Dialog open={activeModal === "insurance"} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Insurance Info</DialogTitle>
              <DialogDescription>
                Enter your insurance details to get the best rates.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInsuranceSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="insuranceProvider" className="text-right">
                    Provider
                  </Label>
                  <Input
                    id="insuranceProvider"
                    type="text"
                    placeholder="Insurance Provider"
                    className="col-span-3"
                    value={userProfile.insuranceProvider}
                    onChange={(e) => setUserProfile({ ...userProfile, insuranceProvider: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="insuranceMemberId" className="text-right">
                    Member ID
                  </Label>
                  <Input
                    id="insuranceMemberId"
                    type="text"
                    placeholder="Member ID"
                    className="col-span-3"
                    value={userProfile.insuranceMemberId}
                    onChange={(e) => setUserProfile({ ...userProfile, insuranceMemberId: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {activeModal === "tier" && (
        <Dialog open={activeModal === "tier"} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Choose Subscription Tier</DialogTitle>
              <DialogDescription>
                Select a tier that best fits your healthcare needs.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Free Tier */}
              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <Crown className="size-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">Free</h3>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">$0</span>
                      <span className="text-sm text-gray-600">/month</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Perfect for getting started. Access basic search and booking features.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-gray-300" 
                    onClick={() => handleTierSelect("free")}
                  >
                    Select Free
                  </Button>
                </div>
              </div>

              {/* Pro Tier */}
              <div className="flex items-start gap-4 p-4 border border-blue-200 rounded-lg hover:border-blue-400 transition-colors bg-blue-50">
                <Crown className="size-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">Pro</h3>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">$9.99</span>
                      <span className="text-sm text-gray-600">/month</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Enhanced features for active healthcare seekers. More tools and priority support.
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700" 
                    onClick={() => handleTierSelect("pro")}
                  >
                    Select Pro
                  </Button>
                </div>
              </div>

              {/* VIP Tier */}
              <div className="flex items-start gap-4 p-4 border border-purple-200 rounded-lg hover:border-purple-400 transition-colors bg-gradient-to-br from-purple-50 to-pink-50">
                <Crown className="size-5 text-purple-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">VIP</h3>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">$24.99</span>
                      <span className="text-sm text-gray-600">/month</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Premium experience with exclusive benefits. Concierge service and advanced features.
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700" 
                    onClick={() => handleTierSelect("vip")}
                  >
                    Select VIP
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-2 border-t">
              <Button 
                variant="link" 
                className="text-blue-600 hover:text-blue-700"
                onClick={() => navigate("/subscription-tiers")}
              >
                Learn More
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
