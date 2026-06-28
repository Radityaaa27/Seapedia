import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  ShoppingBag,
  Wallet,
  Package,
} from "lucide-react";

const roleColors: Record<string, string> = {
  BUYER: "bg-blue-100 text-blue-700 border-blue-200",
  SELLER: "bg-green-100 text-green-700 border-green-200",
  DRIVER: "bg-yellow-100 text-yellow-700 border-yellow-200",
  ADMIN: "bg-red-100 text-red-700 border-red-200",
};

const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Orders", value: "0", icon: ShoppingBag, color: "text-blue-500" },
    { label: "Wallet", value: "Rp 0", icon: Wallet, color: "text-green-500" },
    { label: "Products", value: "0", icon: Package, color: "text-orange-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, {user?.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="w-20 h-20 mb-3">
                <AvatarFallback className="bg-orange-500 text-white text-2xl font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-foreground">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>

              {/* Role badges */}
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {user?.roles.map((r) => (
                  <span
                    key={r.id}
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${roleColors[r.role] ?? ""}`}
                  >
                    {r.role}
                  </span>
                ))}
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-3">
              {[
                { icon: Mail, label: "Email", value: user?.email },
                { icon: Phone, label: "Phone", value: user?.phone || "Not set" },
                {
                  icon: CalendarDays,
                  label: "Joined",
                  value: new Date(user?.createdAt || "").toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }),
                },
                { icon: User, label: "Status", value: user?.isActive ? "Active" : "Inactive" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm">
                  <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground w-16 shrink-0">{item.label}</span>
                  <span className="font-medium text-foreground truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-bold text-foreground">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Placeholder activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No activity yet.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start shopping to see your orders here.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;