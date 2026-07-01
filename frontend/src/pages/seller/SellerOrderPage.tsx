import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { Order, OrderStatus } from "../../types/orderTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Package,
  ChevronRight,
  Loader2,
  RefreshCw,
  ShoppingBag,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
} from "lucide-react";

const statusTabs = [
  { key: "", label: "Semua" },
  { key: "PAID", label: "Perlu Diproses" },
  { key: "PROCESSING", label: "Diproses" },
  { key: "READY_FOR_PICKUP", label: "Siap Pickup" },
  { key: "ON_DELIVERY", label: "Dikirim" },
  { key: "COMPLETED", label: "Selesai" },
  { key: "CANCELLED", label: "Dibatalkan" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: "Menunggu Pembayaran", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Dibayar — Perlu Diproses", color: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "Sedang Diproses", color: "bg-purple-100 text-purple-700" },
  READY_FOR_PICKUP: { label: "Siap Pickup Driver", color: "bg-indigo-100 text-indigo-700" },
  ON_DELIVERY: { label: "Sedang Dikirim", color: "bg-orange-100 text-orange-700" },
  DELIVERED: { label: "Terkirim", color: "bg-teal-100 text-teal-700" },
  COMPLETED: { label: "Selesai", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Dibatalkan", color: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Direfund", color: "bg-gray-100 text-gray-700" },
};

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const SellerOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getSellerOrders(page);
      setOrders(res.data);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      toast.error("Gagal memuat pesanan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleProcess = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await orderService.processOrder(orderId);
      toast.success("Order sedang diproses.");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memproses order.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReady = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await orderService.markReadyForPickup(orderId);
      toast.success("Order siap pickup driver! 🚚");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal update order.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = activeTab
    ? orders.filter((o) => o.status === activeTab)
    : orders;

  const paidCount = orders.filter((o) => o.status === "PAID").length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Pesanan Masuk
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola dan proses pesanan dari pembeli
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Alert banner for pending orders */}
      {paidCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-700">
              {paidCount} pesanan menunggu diproses!
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              Segera proses agar pembeli tidak menunggu terlalu lama.
            </p>
          </div>
          <Button
            size="sm"
            className="ml-auto bg-blue-600 hover:bg-blue-700 shrink-0"
            onClick={() => setActiveTab("PAID")}
          >
            Lihat Sekarang
          </Button>
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {statusTabs.map((tab) => {
          const count = tab.key
            ? orders.filter((o) => o.status === tab.key).length
            : orders.length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-colors shrink-0 ${
                activeTab === tab.key
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-border text-muted-foreground hover:border-orange-400 bg-background"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-2xl bg-muted/10">
          <Package className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground font-medium">
            Tidak ada pesanan{activeTab ? ` dengan status ini` : ""}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const config = statusConfig[order.status] ?? {
              label: order.status,
              color: "bg-gray-100 text-gray-700",
            };

            return (
              <Card
                key={order.id}
                className="border-border hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Card top accent for urgent orders */}
                {order.status === "PAID" && (
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                )}
                {order.status === "PROCESSING" && (
                  <div className="h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                )}

                <CardContent className="p-5">
                  {/* Order header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-mono text-muted-foreground">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {(order as any).buyer?.name ?? "Pembeli"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <p className="font-black text-lg text-orange-500 shrink-0">
                      {formatRupiah(Number(order.totalAmount))}
                    </p>
                  </div>

                  {/* Delivery address */}
                  {(order as any).address && (
                    <div className="flex items-start gap-2 bg-muted/30 rounded-xl p-3 mb-4">
                      <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {(order as any).address.recipientName}
                        </span>{" "}
                        · {(order as any).address.phone}
                        <br />
                        {(order as any).address.street},{" "}
                        {(order as any).address.city}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-muted rounded-lg overflow-hidden shrink-0">
                            {item.productImg ? (
                              <img
                                src={item.productImg}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ShoppingBag className="w-4 h-4 m-2 text-muted-foreground/30" />
                            )}
                          </div>
                          <span className="text-muted-foreground truncate max-w-[200px]">
                            {item.productName}
                          </span>
                        </div>
                        <span className="text-muted-foreground shrink-0 ml-2">
                          ×{item.quantity} ·{" "}
                          {formatRupiah(Number(item.subtotal))}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price breakdown */}
                  <div className="bg-muted/20 rounded-xl p-3 mb-4 text-xs space-y-1">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatRupiah(Number(order.subtotal))}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Ongkir</span>
                      <span>{formatRupiah(Number(order.deliveryFee))}</span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground border-t border-border pt-1 mt-1">
                      <span>Total</span>
                      <span className="text-orange-500">
                        {formatRupiah(Number(order.totalAmount))}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.status === "PAID" && (
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 font-bold rounded-xl flex-1"
                        disabled={actionLoading === order.id}
                        onClick={() => handleProcess(order.id)}
                      >
                        {actionLoading === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Package className="w-4 h-4 mr-2" />
                        )}
                        Proses Order
                      </Button>
                    )}

                    {order.status === "PROCESSING" && (
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl flex-1"
                        disabled={actionLoading === order.id}
                        onClick={() => handleReady(order.id)}
                      >
                        {actionLoading === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Truck className="w-4 h-4 mr-2" />
                        )}
                        Tandai Siap — Minta Driver
                      </Button>
                    )}

                    {order.status === "READY_FOR_PICKUP" && (
                      <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold">
                        <Truck className="w-4 h-4" />
                        Menunggu driver mengambil pesanan...
                      </div>
                    )}

                    {order.status === "ON_DELIVERY" && (
                      <div className="flex items-center gap-2 text-orange-500 text-sm font-semibold">
                        <Truck className="w-4 h-4" />
                        Sedang dalam perjalanan ke pembeli
                      </div>
                    )}

                    {["DELIVERED", "COMPLETED"].includes(order.status) && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Pesanan selesai
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="rounded-xl ml-auto"
                    >
                      Detail{" "}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;