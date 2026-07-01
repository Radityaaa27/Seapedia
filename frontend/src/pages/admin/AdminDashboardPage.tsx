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
  Tag,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  RefreshCw,
} from "lucide-react";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-100 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-100 text-purple-700 border-purple-200",
  READY_FOR_PICKUP: "bg-indigo-100 text-indigo-700 border-indigo-200",
  ON_DELIVERY: "bg-orange-100 text-orange-700 border-orange-200",
  DELIVERED: "bg-teal-100 text-teal-700 border-teal-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  REFUNDED: "bg-gray-100 text-gray-700 border-gray-200",
};

const statusBarColors: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-400",
  PAID: "bg-blue-500",
  PROCESSING: "bg-purple-500",
  READY_FOR_PICKUP: "bg-indigo-500",
  ON_DELIVERY: "bg-orange-500",
  DELIVERED: "bg-teal-500",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-red-400",
  REFUNDED: "bg-gray-400",
};

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  SELLER: "bg-green-100 text-green-700",
  BUYER: "bg-blue-100 text-blue-700",
  DRIVER: "bg-yellow-100 text-yellow-700",
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchOverview = () => {
    setIsLoading(true);
    adminService
      .getOverview()
      .then((data) => {
        setOverview(data);
        setLastUpdated(new Date());
      })
      .catch(() => toast.error("Failed to load overview."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Loading admin overview...</p>
      </div>
    );
  }

  if (!overview) return null;

  const { stats, ordersByStatus, recentOrders, recentUsers } = overview;

  const maxOrderCount = Math.max(...ordersByStatus.map((s) => s._count.id), 1);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString("id-ID"),
      sub: `+${stats.newUsersThisMonth} bulan ini`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Active Stores",
      value: stats.totalStores.toLocaleString("id-ID"),
      icon: Store,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      trend: "+5%",
      trendUp: true,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString("id-ID"),
      sub: `+${stats.newOrdersThisMonth} bulan ini`,
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      trend: "+18%",
      trendUp: true,
    },
    {
      label: "Total Revenue",
      value: formatRupiah(stats.totalRevenue),
      sub: formatRupiah(stats.thisMonthRevenue) + " bulan ini",
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      trend: "+24%",
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      label: "Manage Users",
      icon: Users,
      path: "/admin/users",
      color: "bg-blue-500 hover:bg-blue-600",
      desc: "Kelola akun pengguna",
    },
    {
      label: "Vouchers & Promos",
      icon: Tag,
      path: "/admin/vouchers",
      color: "bg-purple-500 hover:bg-purple-600",
      desc: "Buat & kelola diskon",
    },
    {
      label: "Overdue Orders",
      icon: AlertTriangle,
      path: "/admin/orders/overdue",
      color: "bg-orange-500 hover:bg-orange-600",
      desc: "Order yang belum selesai",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-rose-600 rounded-3xl p-8 text-white shadow-xl">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/10 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="text-red-100 text-sm font-medium">SEAPEDIA ADMIN</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
              <p className="text-red-100 text-sm mt-1">
                Marketplace overview & management control center
              </p>
            </div>
            <div className="flex items-center gap-2 text-red-200 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated: {lastUpdated.toLocaleTimeString("id-ID")}</span>
              <button
                onClick={fetchOverview}
                className="ml-1 p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${action.color}`}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className={`border ${stat.border} hover:shadow-md transition-shadow duration-200`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${stat.trendUp ? "text-green-600" : "text-red-500"}`}>
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-0.5">{stat.label}</p>
              <p className={`font-black text-xl text-foreground leading-tight`}>
                {stat.value}
              </p>
              {stat.sub && (
                <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  {stat.sub}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Orders by Status */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 font-bold">
              <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-orange-500" />
              </div>
              Order Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ordersByStatus.map((s) => (
              <div key={s.status} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[s.status] ?? "bg-muted text-muted-foreground border-border"}`}>
                    {s.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm font-bold text-foreground">{s._count.id}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusBarColors[s.status] ?? "bg-gray-400"}`}
                    style={{ width: `${(s._count.id / maxOrderCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-blue-500" />
              </div>
              Recent Users
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/users")}
              className="text-xs text-orange-500 hover:text-orange-600 font-semibold"
            >
              Lihat Semua <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.slice(0, 5).map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => navigate("/admin/users")}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="flex gap-1 shrink-0 flex-wrap">
                    {user.roles.map((r: any) => (
                      <span
                        key={r.role}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleColors[r.role] ?? "bg-muted text-muted-foreground"}`}
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
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 text-green-600" />
            </div>
            Recent Orders
          </CardTitle>
          <Badge variant="outline" className="text-xs font-medium">
            {recentOrders.length} orders
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3.5 bg-muted/30 hover:bg-muted/50 rounded-xl text-sm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.buyer?.name ?? "—"} → {order.store?.name ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusColors[order.status] ?? "bg-muted text-muted-foreground border-border"}`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                  <p className="font-bold text-orange-500 min-w-[100px] text-right">
                    {formatRupiah(Number(order.totalAmount))}
                  </p>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10">
                <ShoppingBag className="w-10 h-10 text-muted-foreground/20 mb-2" />
                <p className="text-sm text-muted-foreground">Belum ada order.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;