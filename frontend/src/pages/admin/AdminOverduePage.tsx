import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertTriangle,
  Clock,
  RefreshCw,
  Loader2,
  CheckCircle,
  Package,
  Zap,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

interface OverdueOrder {
  id: string;
  status: string;
  totalAmount: number;
  deliveryMethod: string;
  createdAt: string;
  ageDays: number;
  thresholdDays: number;
  willBe: "REFUNDED" | "RETURNED";
  buyer: { id: string; name: string; email: string };
  store: { name: string };
  items: { productName: string; quantity: number }[];
}

const AdminOverduePage = () => {
  const navigate = useNavigate();
  const [pendingOverdue, setPendingOverdue] = useState<OverdueOrder[]>([]);
  const [inTransitOverdue, setInTransitOverdue] = useState<OverdueOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOverdue = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getOverdueOrders();
      // res could be { pendingShipmentOverdue, inTransitOverdue } or flat array
      if (Array.isArray(res)) {
        setPendingOverdue(res.filter((o: any) => o.willBe === "REFUNDED"));
        setInTransitOverdue(res.filter((o: any) => o.willBe === "RETURNED"));
      } else {
        setPendingOverdue((res as any).pendingShipmentOverdue ?? []);
        setInTransitOverdue((res as any).inTransitOverdue ?? []);
      }
    } catch {
      toast.error("Gagal memuat overdue orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdue();
  }, []);

  const handleRunOverdueCheck = async () => {
    setIsRunning(true);
    try {
      await adminService.runOverdueCheck();
      toast.success("Overdue check selesai! Order yang overdue sudah diproses.");
      await fetchOverdue();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menjalankan overdue check.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleForceCancel = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      await adminService.forceCancelOrder(orderId);
      toast.success("Order direfund paksa.");
      await fetchOverdue();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memproses order.");
    } finally {
      setActionLoading(null);
    }
  };

  const totalOverdue = pendingOverdue.length + inTransitOverdue.length;

  const OrderCard = ({ order, type }: { order: OverdueOrder; type: "refund" | "return" }) => (
    <Card className={`border-2 ${type === "refund" ? "border-red-200" : "border-amber-200"}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-mono text-muted-foreground">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
              <Badge
                className={`text-xs border-none ${
                  type === "refund"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {type === "refund" ? "⚠ Akan Direfund" : "📦 Akan Dikembalikan"}
              </Badge>
            </div>
            <p className="text-sm font-bold">{order.buyer.name}</p>
            <p className="text-xs text-muted-foreground">{order.buyer.email}</p>
            <p className="text-xs text-muted-foreground">
              Toko: {order.store.name}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-black text-lg text-orange-500">
              {formatRupiah(Number(order.totalAmount))}
            </p>
            <p className="text-xs text-muted-foreground">
              Metode: {order.deliveryMethod || "—"}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-3 mb-3">
          <Clock className="w-4 h-4 text-red-500 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-red-600">
              {Math.round(order.ageDays)} hari
            </span>
            <span className="text-muted-foreground">
              {" "}sudah berlalu (batas: {order.thresholdDays} hari)
            </span>
            <span className="font-bold text-red-600">
              {" "}+{Math.round(order.ageDays - order.thresholdDays)} hari overdue
            </span>
          </div>
        </div>

        {/* Items preview */}
        <div className="space-y-1 mb-4">
          {order.items.slice(0, 2).map((item, i) => (
            <div key={i} className="text-xs text-muted-foreground flex items-center gap-1">
              <Package className="w-3 h-3" />
              {item.productName} ×{item.quantity}
            </div>
          ))}
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
            Status: {order.status.replace(/_/g, " ")}
          </span>
          <Button
            size="sm"
            className={`rounded-xl text-xs font-bold ${
              type === "refund"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
            disabled={actionLoading === order.id}
            onClick={() => handleForceCancel(order.id)}
          >
            {actionLoading === order.id ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : null}
            {type === "refund" ? "Force Refund" : "Force Return"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/dashboard")}
          className="text-muted-foreground"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Dashboard
        </Button>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-rose-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute right-6 bottom-4 opacity-10">
          <AlertTriangle className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-2">
            Admin Panel
          </p>
          <h1 className="text-2xl font-black mb-1">Overdue Orders</h1>
          <p className="text-red-100 text-sm max-w-lg">
            Monitor pesanan yang melebihi batas waktu pengiriman. Sistem akan
            otomatis memproses refund atau return berdasarkan metode pengiriman.
          </p>
          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="bg-white/10 rounded-xl px-4 py-2">
              <p className="text-2xl font-black">{totalOverdue}</p>
              <p className="text-xs text-red-200">Total Overdue</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2">
              <p className="text-2xl font-black">{pendingOverdue.length}</p>
              <p className="text-xs text-red-200">Perlu Direfund</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2">
              <p className="text-2xl font-black">{inTransitOverdue.length}</p>
              <p className="text-xs text-red-200">Perlu Dikembalikan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          className="bg-red-500 hover:bg-red-600 font-bold rounded-xl gap-2"
          onClick={handleRunOverdueCheck}
          disabled={isRunning}
        >
          {isRunning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {isRunning ? "Memproses..." : "Jalankan Auto Overdue Check"}
        </Button>
        <Button
          variant="outline"
          className="rounded-xl gap-2"
          onClick={fetchOverdue}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700">
        <p className="font-bold mb-1">ℹ️ Cara kerja Overdue Check:</p>
        <ul className="text-xs space-y-1 text-blue-600">
          <li>• <strong>Instant</strong>: overdue setelah 1 hari tanpa dikirim</li>
          <li>• <strong>Next Day</strong>: overdue setelah 2 hari</li>
          <li>• <strong>Regular</strong>: overdue setelah 7 hari</li>
          <li>• Pesanan yang belum dikirim driver → <strong>Auto Refund</strong></li>
          <li>• Pesanan yang sudah dikirim tapi tidak dikonfirmasi → <strong>Auto Return</strong></li>
          <li>• Klik "Jalankan Auto Overdue Check" untuk mensimulasi hari berikutnya</li>
        </ul>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : totalOverdue === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-2xl text-center bg-muted/10">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
          <p className="font-bold text-foreground text-lg">Tidak ada overdue orders!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Semua pesanan berjalan tepat waktu.
          </p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Pre-shipment overdue — will be REFUNDED */}
          {pendingOverdue.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <h2 className="font-bold text-foreground">
                  Belum Dikirim — Akan Direfund ({pendingOverdue.length})
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Pesanan ini masih dalam status Sedang Dikemas atau Menunggu Pengirim
                dan sudah melewati batas waktu. Buyer berhak mendapat refund penuh.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingOverdue.map((order) => (
                  <OrderCard key={order.id} order={order} type="refund" />
                ))}
              </div>
            </div>
          )}

          {/* Post-shipment overdue — will be RETURNED */}
          {inTransitOverdue.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <h2 className="font-bold text-foreground">
                  Sudah Dikirim tapi Tidak Dikonfirmasi — Akan Dikembalikan ({inTransitOverdue.length})
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Pesanan ini sudah dalam perjalanan atau sudah diantar tapi buyer
                tidak mengkonfirmasi dalam waktu yang ditentukan.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inTransitOverdue.map((order) => (
                  <OrderCard key={order.id} order={order} type="return" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOverduePage;