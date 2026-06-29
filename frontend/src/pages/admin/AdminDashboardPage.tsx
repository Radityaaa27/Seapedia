import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { AdminOverview } from "../../types/adminTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Loader2,
  ChevronRight,
} from "lucide-react";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  READY_FOR_PICKUP: "bg-indigo-100 text-indigo-700",
  ON_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-teal-100 text-teal-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService
      .getOverview()
      .then(setOverview)
      .catch(() => toast.error("Failed to load overview."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!overview) return null;

  const { stats, ordersByStatus, recentOrders, recentUsers } = overview;

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      sub: `+${stats.newUsersThisMonth} this month`,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Active Stores",
      value: stats.totalStores,
      icon: Store,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      sub: `+${stats.newOrdersThisMonth} this month`,
      icon: ShoppingBag,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Total Revenue",
      value: formatRupiah(stats.totalRevenue),
      sub: `${formatRupiah(stats.thisMonthRevenue)} this month`,
      icon: DollarSign,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-red-100 text-sm">
          SEAPEDIA marketplace overview and management.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Button
            size="sm"
            className="bg-white text-red-600 hover:bg-red-50"
            onClick={() => navigate("/admin/users")}
          >
            <Users className="w-4 h-4 mr-1" /> Manage Users
          </Button>
          <Button
            size="sm"
            className="bg-white text-red-600 hover:bg-red-50"
            onClick={() => navigate("/admin/vouchers")}
          >
            <Package className="w-4 h-4 mr-1" /> Manage Vouchers
          </Button>
          <Button
            size="sm"
            className="bg-white/20 text-white hover:bg-white/30 border border-white/30"
            onClick={() => navigate("/admin/orders/overdue")}
          >
            <AlertTriangle className="w-4 h-4 mr-1" /> Overdue Orders
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${stat.bg}`}
              >
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="font-bold text-foreground text-lg leading-tight">
                {stat.value}
              </p>
              {stat.sub && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.sub}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Orders by status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ordersByStatus.map((s) => (
                <div
                  key={s.status}
                  className="flex items-center justify-between"
                >
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      statusColors[s.status] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {s._count.id}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Recent Users</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/users")}
              className="text-xs text-orange-500"
            >
              See all <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0 text-orange-600 font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {user.roles.map((r: any) => (
                      <span
                        key={r.role}
                        className="text-xs bg-muted px-1.5 py-0.5 rounded"
                      >
                        {r.role}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.buyer?.name} → {order.store?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      statusColors[order.status] ??
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                  <p className="font-semibold text-orange-500">
                    {formatRupiah(Number(order.totalAmount))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;