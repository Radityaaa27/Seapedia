import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { walletService } from "../../services/walletService";
import { orderService } from "../../services/orderService";
import { Wallet } from "../../types/walletTypes";
import { Order } from "../../types/orderTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Wallet as WalletIcon,
  MapPin,
  Tag,
  Plus,
  ArrowRight,
  Package,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: "Menunggu Bayar", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Dibayar", color: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "Diproses", color: "bg-purple-100 text-purple-700" },
  READY_FOR_PICKUP: { label: "Siap Pickup", color: "bg-indigo-100 text-indigo-700" },
  ON_DELIVERY: { label: "Dikirim", color: "bg-orange-100 text-orange-700" },
  DELIVERED: { label: "Terkirim", color: "bg-teal-100 text-teal-700" },
  COMPLETED: { label: "Selesai", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Dibatalkan", color: "bg-red-100 text-red-700" },
};

const BuyerDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    walletService.getWallet().then(setWallet).catch(() => {});
    orderService.getMyOrders(1).then((res) => setOrders(res.data?.slice(0, 3) ?? [])).catch(() => {});
  }, []);

  const totalSpent = orders.reduce(
    (sum, o) => (o.status !== "CANCELLED" && o.status !== "REFUNDED"
      ? sum + Number(o.totalAmount) : sum), 0
  );

  const quickActions = [
    { label: "Top Up Wallet", icon: Plus, path: "/wallet", color: "bg-orange-500 hover:bg-orange-600" },
    { label: "Belanja", icon: ShoppingBag, path: "/products", color: "bg-blue-500 hover:bg-blue-600" },
    { label: "My Orders", icon: Package, path: "/orders", color: "bg-green-500 hover:bg-green-600" },
    { label: "Vouchers", icon: Tag, path: "/vouchers", color: "bg-purple-500 hover:bg-purple-600" },
    { label: "Alamat", icon: MapPin, path: "/addresses", color: "bg-teal-500 hover:bg-teal-600" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute right-8 bottom-4 opacity-10">
          <ShoppingBag className="w-28 h-28" />
        </div>
        <div className="relative z-10">
          <p className="text-orange-100 text-sm font-semibold mb-1">Selamat datang kembali 👋</p>
          <h1 className="text-2xl font-black">{user?.name}</h1>
          <p className="text-orange-100 text-sm mt-1">
            Temukan produk terbaik di SEAPEDIA hari ini!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Profil Saya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-black mb-3">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-bold text-foreground">{user?.name}</h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <div className="flex gap-2 mt-2 flex-wrap justify-center">
                {user?.roles.map((r) => (
                  <Badge
                    key={r.id}
                    className="text-xs bg-orange-100 text-orange-700 border-none"
                  >
                    {r.role}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {[
                { icon: Mail, label: "Email", value: user?.email },
                { icon: Phone, label: "Phone", value: user?.phone || "Belum diset" },
                {
                  icon: CalendarDays,
                  label: "Bergabung",
                  value: new Date(user?.createdAt || "").toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                  }),
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs w-16 shrink-0">{item.label}</span>
                  <span className="text-xs font-medium truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">

          {/* Wallet Card */}
          <div
            className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/wallet")}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-orange-400 font-bold uppercase tracking-widest mb-1">
                  SeaWallet Balance
                </p>
                <p className="text-3xl font-black">
                  {formatRupiah(Number(wallet?.balance ?? 0))}
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  Account Holder: <span className="text-white font-semibold">{user?.name?.toUpperCase()}</span>
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <WalletIcon className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <Button
              size="sm"
              className="mt-4 bg-orange-500 hover:bg-orange-600 rounded-full text-xs font-bold"
              onClick={(e) => { e.stopPropagation(); navigate("/wallet"); }}
            >
              <Plus className="w-3 h-3 mr-1" /> Top Up
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Pesanan</p>
                  <p className="font-black text-xl text-blue-600">{orders.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <WalletIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Belanja</p>
                  <p className="font-black text-lg text-green-600">{formatRupiah(totalSpent)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-3">Aksi Cepat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl text-white font-bold text-center transition-all hover:shadow-lg hover:-translate-y-0.5 ${action.color}`}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm">Pesanan Terbaru</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/orders")}
            className="text-orange-500 text-xs"
          >
            Lihat semua <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/20 mb-2" />
              <p className="text-sm text-muted-foreground">Belum ada pesanan.</p>
              <Button
                size="sm"
                className="mt-3 bg-orange-500 hover:bg-orange-600 rounded-xl"
                onClick={() => navigate("/products")}
              >
                Mulai Belanja
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const config = statusConfig[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-700" };
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm font-semibold">{order.store.name}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} item(s)</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${config.color}`}>
                        {config.label}
                      </span>
                      <p className="text-sm font-black text-orange-500 mt-1">
                        {formatRupiah(Number(order.totalAmount))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerDashboardPage;