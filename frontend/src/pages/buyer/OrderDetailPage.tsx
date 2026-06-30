import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { Order, OrderStatus } from "../../types/orderTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronLeft,
  MapPin,
  Package,
  Loader2,
  X,
  Truck,
} from "lucide-react";

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Paid", color: "bg-blue-100 text-blue-700" },
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

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const data = await orderService.getOrderDetail(id);
      setOrder(data);
    } catch {
      toast.error("Failed to load order.");
      navigate("/orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    try {
      await orderService.cancelOrder(order.id);
      toast.success("Order cancelled. Refund processed.");
      fetchOrder();
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

  if (!order) return null;

  const config = statusConfig[order.status];
  const canCancel = ["PENDING_PAYMENT", "PAID"].includes(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/orders")}
        className="mb-4 text-muted-foreground"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
      </Button>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`text-sm font-semibold px-3 py-1.5 rounded-full ${config.color}`}
        >
          {config.label}
        </span>
      </div>

      <div className="space-y-4">

        {/* Store */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{order.store.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden shrink-0">
                  {item.productImg ? (
                    <img
                      src={item.productImg}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRupiah(Number(item.price))} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-orange-500 shrink-0">
                  {formatRupiah(Number(item.subtotal))}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Delivery Address */}
        {order.address && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{order.address.recipientName}</p>
              <p className="text-sm text-muted-foreground">{order.address.phone}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.address.street}, {order.address.city},{" "}
                {order.address.province} {order.address.postalCode}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Delivery Status */}
        {order.delivery && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />
                Delivery Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">{order.delivery.status}</Badge>
            </CardContent>
          </Card>
        )}

        {/* Price Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatRupiah(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>{formatRupiah(Number(order.deliveryFee))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatRupiah(Number(order.taxAmount))}</span>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatRupiah(Number(order.discountAmount))}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-orange-500">
                {formatRupiah(Number(order.totalAmount))}
              </span>
            </div>
          </CardContent>
        </Card>

        {order.notes && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Order Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </CardContent>
          </Card>
        )}

        {canCancel && (
          <Button
            variant="outline"
            className="w-full text-red-500 hover:text-red-600"
            onClick={handleCancel}
          >
            <X className="w-4 h-4 mr-1" /> Cancel Order
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;