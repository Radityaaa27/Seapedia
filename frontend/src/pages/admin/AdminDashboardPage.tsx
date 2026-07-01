import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { AdminOverview } from "../../types/adminTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Tag,
  UserCog,
  BarChart3,
} from "lucide-react";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-500",
  PAID: "bg-blue-500",
  PROCESSING: "bg-purple-500",
  READY_FOR_PICKUP: "bg-indigo-500",
  ON_DELIVERY: "bg-orange-500",
  DELIVERED: "bg-teal-500",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-red-500",
  REFUNDED: "bg-gray-500",
};

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Bayar",
  PAID: "Dibayar",
  PROCESSING: "Diproses",
  READY_FOR_PICKUP: "Siap Pickup",
  ON_DELIVERY: "Dikirim",
  DELIVERED: "Terkirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  REFUNDED: "Direfund",
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

  useEffect(() => {
    adminService
      .getOverview()
      .then(setOverview)
      .catch(() => toast.error("Gagal memuat overview."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Memuat dashboard admin...
        </p>
      </div>
    );
  }

  if (!overview) return null;

  const { stats, ordersByStatus, recentOrders, recentUsers } = overview;

  const totalOrdersForProgress = ordersByStatus.reduce(
    (sum, s) => sum + s._count.id,
    0
  );

  const statCards = [
    {
      label: "Total User",
      value: stats.totalUsers,
      sub: `+${stats.newUsersThisMonth} bulan ini`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Toko Aktif",
      value: stats.totalStores,
      icon: Store,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      label: "Total Order",
      value: stats.totalOrders,
      sub: `+${stats.newOrdersThisMonth} bulan ini`,
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
    {
      label: "Total Revenue",
      value: formatRupiah(stats.totalRevenue),
      sub: `${formatRupiah(stats.thisMonthRevenue)} bulan ini`,
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
  ];

  const quickActions = [
    {
      label: "Kelola User",
      desc: "Assign role, aktifkan/nonaktifkan akun",
      icon: UserCog,
      color: "bg-blue-500 hover:bg-blue-600",
      path: "/admin/users",
    },
    {
      label: "Kelola Voucher",
      desc: "Buat & kelola kode diskon",
      icon: Tag,
      color: "bg-orange-500 hover:bg-orange-600",
      path: "/admin/vouchers",
    },
    {
      label: "Order Overdue",
      desc: "Pantau & refund order bermasalah",
      icon: AlertTriangle,
      color: "bg-red-500 hover:bg-red-600",
      path: "/admin/orders/overdue",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-rose-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-28 h-28 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute right-8 bottom-4 opacity-10">
          <BarChart3 className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10">
          <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-2">
            Admin Panel
          </p>
          <h1 className="text-3xl font-black tracking-tight mb-1">
            SEAPEDIA Dashboard
          </h1>
          <p className="text-red-100 text-sm max-w-md">
            Monitor marketplace, kelola pengguna, dan pantau transaksi secara real-time.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className={`border ${stat.border}`}>
            <CardContent className="p-5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.bg}`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {stat.label}
              </p>
              <p className={`font-black text-xl mt-0.5 ${stat.color}`}>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-4 p-5 rounded-2xl text-white font-bold text-left transition-all hover:shadow-lg hover:-translate-y-0.5 ${action.color}`}
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold">{action.label}</p>
              <p className="text-xs opacity-80 mt-0.5">{action.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 ml-auto opacity-70" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Orders by Status — Progress bars */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              Order Berdasarkan Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ordersByStatus.map((s) => (
              <div key={s.status}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-foreground">
                    {statusLabels[s.status] ?? s.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs font-black text-foreground">
                    {s._count.id}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      statusColors[s.status] ?? "bg-gray-400"
                    }`}
                    style={{
                      width: `${
                        totalOrdersForProgress > 0
                          ? (s._count.id / totalOrdersForProgress) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">User Terbaru</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/users")}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Lihat semua <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shrink-0 text-white font-black text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {user.roles.map((r: any) => (
                      <span
                        key={r.role}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          roleColors[r.role] ??
                          "bg-muted text-muted-foreground"
                        }`}
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

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Order Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-xl text-sm hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="font-semibold truncate">
                      {order.buyer?.name} → {order.store?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      (statusColors[order.status] ?? "bg-gray-500")
                        .replace("bg-", "bg-")
                        .replace("-500", "-100")
                    } text-${
                      (statusColors[order.status] ?? "bg-gray-500")
                        .replace("bg-", "")
                        .replace("-500", "-700")
                    }`}
                  >
                    {statusLabels[order.status] ?? order.status}
                  </span>
                  <p className="font-black text-orange-500">
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