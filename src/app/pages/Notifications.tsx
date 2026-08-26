import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
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
  User,
  Settings,
  Bell,
  LogOut,
  Calendar,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import { PHIIndicator } from "../components/PHIIndicator";

interface Notification {
  id: number;
  type: 'appointment' | 'message' | 'payment' | 'system' | 'reminder' | 'security';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  isPHI?: boolean;
  actionUrl?: string;
  actionText?: string;
}

/**
 * Notifications page.
 *
 * The original design shipped with eight invented notifications — a fake
 * appointment reminder naming "Dr. Sarah Johnson", a fake lab-results
 * message, a fake $150 payment confirmation, a fake login-location alert.
 * There is no notifications backend in this project, so the list starts
 * empty and the page's existing empty state ("No notifications to display")
 * is what actually renders.
 */
export function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment': return <Calendar className="size-5 text-blue-600" />;
      case 'message': return <MessageSquare className="size-5 text-green-600" />;
      default: return <Bell className="size-5 text-gray-600" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.type === activeTab;
  });

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
              <Button variant="ghost" size="sm" className="text-gray-600 relative" onClick={() => navigate("/notifications")}>
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-sm md:text-base text-gray-600">
                No notifications backend is connected yet — this list will populate once one exists.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <PHIIndicator type="banner" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                </div>
                <Bell className="size-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                </div>
                <AlertCircle className="size-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <Calendar className="size-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <MessageSquare className="size-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-gray-200 p-4">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="appointment" className="hidden lg:flex">Appointments</TabsTrigger>
                  <TabsTrigger value="message" className="hidden lg:flex">Messages</TabsTrigger>
                  <TabsTrigger value="payment" className="hidden lg:flex">Payments</TabsTrigger>
                  <TabsTrigger value="reminder" className="hidden lg:flex">Reminders</TabsTrigger>
                  <TabsTrigger value="security" className="hidden lg:flex">Security</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="mt-0">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="size-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No notifications to display</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredNotifications.map((notification) => (
                      <div key={notification.id} className="p-4 md:p-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                            <p className="text-xs text-gray-500">{notification.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
