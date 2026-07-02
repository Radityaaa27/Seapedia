import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { Order, OrderStatus } from "../../types/orderTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingBag, ChevronRight, Loader2, X } from "lucide-react";

const statusConfig: Record <OrderStatus,
  { label: string; color: string }
> = {
  PENDING_PAYMENT: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Paid", color: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "Processing", color: "bg-purple-100 text-purple-700" },
  READY_FOR_PICKUP: { label: "Ready for Pickup", color: "bg-indigo-100 text-indigo-700" },
  ON_DELIVERY: { label: "On Delivery", color: "bg-orange-100 text-orange-700" },
  DELIVERED: { label: "Delivered", color: "bg-teal-100 text-teal-700" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Refunded", color: "bg-gray-100 text-gray-700" },
  RETURNED: { label: "Returned", color: "bg-gray-100 text-gray-700" },
};

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getMyOrders(page);
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

  const handleCancel = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      toast.success("Order cancelled. Refund processed.");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel order.");
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground">No orders yet.</p>
          <Button
            className="mt-4 bg-orange-500 hover:bg-orange-600"
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status];
            const canCancel = ["PENDING_PAYMENT", "PAID"].includes(order.status);

            return (
              <Card key={order.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {order.store.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Items preview */}
                  <div className="space-y-1 mb-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-8 h-8 bg-muted rounded overflow-hidden shrink-0">
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
                        <span className="truncate text-muted-foreground">
                          {item.productName}
                        </span>
                        <span className="text-muted-foreground shrink-0">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-muted-foreground pl-10">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-bold text-orange-500">
                        {formatRupiah(Number(order.totalAmount))}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {canCancel && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(order.id)}
                          className="text-red-500 hover:text-red-600 text-xs"
                        >
                          <X className="w-3 h-3 mr-1" /> Cancel
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

          {/* Pagination */}
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

export default OrdersPage;