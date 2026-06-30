import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { walletService } from "../services/walletService";
import { orderService } from "../services/orderService";
import { Wallet as WalletType } from "../types/walletTypes";
import { Order as OrderType } from "../types/orderTypes";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  ShoppingBag,
  Wallet,
  ArrowRight,
  Loader2,
  DollarSign,
  Plus,
  Anchor,
} from "lucide-react";

const roleColors: Record<string, string> = {
  BUYER: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  SELLER: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  DRIVER: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  ADMIN: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [walletData, ordersData] = await Promise.all([
          walletService.getWallet().catch(() => null),
          orderService.getMyOrders(1).catch(() => ({ data: [], meta: {} })),
        ]);
        setWallet(walletData);
        setOrders(ordersData.data || []);
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalSpent = orders.reduce((sum, o) => {
    if (o.status !== "CANCELLED") {
      return sum + Number(o.totalAmount);
    }
    return sum;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back to Seapedia, <span className="font-semibold text-foreground">{user?.name}</span>!
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Profile Detail */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-border/60 overflow-hidden shadow-sm">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="text-base font-bold tracking-tight">My Profile</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="w-24 h-24 mb-4 border-2 border-orange-500/20 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-tr from-orange-500 to-amber-500 text-white text-3xl font-black">
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-extrabold text-lg text-foreground tracking-tight">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>

                  {/* Role list badges */}
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {user?.roles.map((r) => (
                      <span
                        key={r.id}
                        className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full border ${
                          roleColors[r.role] ?? ""
                        }`}
                      >
                        {r.role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Profile Stats List */}
                <div className="space-y-3.5 border-t border-border/60 pt-6">
                  {[
                    { icon: Mail, label: "Email Address", value: user?.email },
                    { icon: Phone, label: "Contact Phone", value: user?.phone || "Not configured" },
                    {
                      icon: CalendarDays,
                      label: "Member Since",
                      value: new Date(user?.createdAt || "").toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }),
                    },
                    { icon: User, label: "Account Status", value: user?.isActive ? "Active Verified" : "Suspended" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 text-sm">
                      <item.icon className="w-4 h-4 text-orange-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                        <p className="font-semibold text-foreground truncate mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Key SaaS Stats & Orders */}
          <div className="lg:col-span-8 space-y-6">
            {/* SaaS Stat Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sleek Credit Card SeaWallet Display */}
              <div className="bg-gradient-to-tr from-slate-900 via-slate-950 to-orange-950/40 rounded-3xl p-6 relative overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between h-48 text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                <div className="flex justify-between items-start z-10">
                  <div>
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">SeaWallet Balance</p>
                    <p className="text-2xl font-black mt-1">
                      Rp {wallet ? Number(wallet.balance).toLocaleString("id-ID") : "0"}
                    </p>
                  </div>
                  <Wallet className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex justify-between items-end z-10">
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">Account holder</p>
                    <p className="text-xs font-semibold uppercase tracking-wide">{user?.name}</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold gap-1 px-3 shadow-md border-none"
                    onClick={() => navigate("/wallet")}
                  >
                    <Plus className="w-3.5 h-3.5" /> Top Up
                  </Button>
                </div>
              </div>

              {/* General Orders/Spending Card */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/25">
                    <ShoppingBag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Total Orders Placed</p>
                    <p className="text-2xl font-black text-foreground mt-0.5">{orders.length}</p>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Accumulated Spending</p>
                    <p className="text-xl font-black text-foreground mt-0.5">
                      Rp {totalSpent.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Catalog Block */}
            <Card className="border border-border/60">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                <CardTitle className="text-base font-bold tracking-tight">Recent Orders</CardTitle>
                {orders.length > 0 && (
                  <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600 text-xs font-bold" onClick={() => navigate("/orders")}>
                    View All Orders <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="pt-6">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mb-3" />
                    <p className="text-sm font-semibold text-muted-foreground">No recent orders found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start browsing our product catalog to fill your cart.
                    </p>
                    <Button asChild size="sm" className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                      <Link to="/products">Browse Seafood</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border/60 rounded-xl hover:border-orange-500/30 hover:shadow-sm cursor-pointer transition-all duration-300 gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/15">
                            <Anchor className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{order.store.name}</p>
                            <p className="text-[10px] text-muted-foreground font-semibold">
                              {new Date(order.createdAt).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                          <Badge className="bg-orange-500/10 text-orange-600 border-none font-semibold px-2 py-0.5 text-[10px] rounded-full">
                            {order.status}
                          </Badge>
                          <p className="text-sm font-black text-foreground">
                            Rp {Number(order.totalAmount).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;