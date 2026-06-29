import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { Order, OrderStatus } from "../../types/orderTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package, ChevronRight, Loader2 } from "lucide-react";

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Paid — Action Required", color: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "Processing", color: "bg-purple-100 text-purple-700" },
  READY_FOR_PICKUP: { label: "Ready for Pickup", color: "bg-indigo-100 text-indigo-700" },
  ON_DELIVERY: { label: "On Delivery", color: "bg-orange-100 text-orange-700" },
  DELIVERED: { label: "Delivered", color: "bg-teal-100 text-teal-700" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Refunded", color: "bg-gray-100 text-gray-700" },
};

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const SellerOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getSellerOrders(page);
      setOrders(res.data);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      toast.error("Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleProcess = async (orderId: string) => {
    try {
      await orderService.processOrder(orderId);
      toast.success("Order is now being processed.");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to process order.");
    }
  };

  const handleReady = async (orderId: string) => {
    try {
      await orderService.markReadyForPickup(orderId);
      toast.success("Order marked as ready for pickup.");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update order.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Incoming Orders
      </h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status];

            return (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm font-semibold">
                        {(order as any).buyer?.name ?? "Buyer"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-1 mb-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground truncate">
                          {item.productName}
                        </span>
                        <span className="text-muted-foreground shrink-0 ml-2">
                          ×{item.quantity} · {formatRupiah(Number(item.subtotal))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <p className="font-bold text-orange-500">
                      {formatRupiah(Number(order.totalAmount))}
                    </p>
                    <div className="flex gap-2">
                      {order.status === "PAID" && (
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-xs"
                          onClick={() => handleProcess(order.id)}
                        >
                          Process Order
                        </Button>
                      )}
                      {order.status === "PROCESSING" && (
                        <Button
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                          onClick={() => handleReady(order.id)}
                        >
                          Mark Ready
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="text-xs"
                      >
                        Detail <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
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
      )}
    </div>
  );
};

export default SellerOrdersPage;