import { useState, useEffect } from "react";
import api from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  DollarSign,
  Loader2,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

interface Report {
  store: { id: string; name: string };
  summary: {
    totalRevenue: number;
    thisMonthRevenue: number;
    lastMonthRevenue: number;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalProducts: number;
  };
  topProducts: {
    productId: string;
    productName: string;
    _sum: { quantity: number; subtotal: number };
  }[];
  recentOrders: any[];
  monthlyRevenue: { month: string; revenue: number }[];
}

const ReportPage = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: Report }>("/reports/seller")
      .then((res) => setReport(res.data.data))
      .catch(() => toast.error("Failed to load report."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!report) return null;

  const { summary, topProducts, recentOrders, monthlyRevenue } = report;
  const revenueGrowth =
    summary.lastMonthRevenue > 0
      ? ((summary.thisMonthRevenue - summary.lastMonthRevenue) /
          summary.lastMonthRevenue) *
        100
      : 0;
  const isGrowthPositive = revenueGrowth >= 0;

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);

  const statCards = [
    {
      label: "Total Revenue",
      value: formatRupiah(summary.totalRevenue),
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "This Month",
      value: formatRupiah(summary.thisMonthRevenue),
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-50",
      sub:
        summary.lastMonthRevenue > 0
          ? `${isGrowthPositive ? "+" : ""}${revenueGrowth.toFixed(1)}% vs last month`
          : "No data last month",
      isGrowthPositive,
    },
    {
      label: "Total Orders",
      value: summary.totalOrders,
      icon: ShoppingBag,
      color: "text-orange-500",
      bg: "bg-orange-50",
      sub: `${summary.completedOrders} completed`,
    },
    {
      label: "Active Products",
      value: summary.totalProducts,
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Store Report
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {report.store.name} · Performance overview
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}
                >
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="font-bold text-foreground text-lg leading-tight">
                {stat.value}
              </p>
              {stat.sub && (
                <p
                  className={`text-xs mt-0.5 flex items-center gap-0.5 ${
                    stat.isGrowthPositive !== undefined
                      ? stat.isGrowthPositive
                        ? "text-green-500"
                        : "text-red-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.isGrowthPositive !== undefined &&
                    (stat.isGrowthPositive ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    ))}
                  {stat.sub}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              Revenue Last 6 Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {monthlyRevenue.map((m) => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0">
                    {m.month}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{
                        width: `${(m.revenue / maxRevenue) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-24 text-right shrink-0">
                    {m.revenue > 0 ? formatRupiah(m.revenue) : "—"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No sales data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((p, index) => (
                  <div
                    key={p.productId}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-600"
                          : index === 1
                          ? "bg-gray-100 text-gray-600"
                          : index === 2
                          ? "bg-orange-100 text-orange-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {p.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p._sum.quantity} sold ·{" "}
                        {formatRupiah(Number(p._sum.subtotal))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No orders yet.
            </p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.buyer?.name} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-500">
                      {formatRupiah(Number(order.totalAmount))}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs mt-0.5"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;