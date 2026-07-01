import { useState, useEffect } from "react";
import { driverService } from "../../services/driverService";
import { Delivery } from "../../types/driverTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Truck,
  MapPin,
  Package,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  DollarSign,
  Store,
  ArrowRight,
  Navigation,
  Phone,
  AlertCircle,
} from "lucide-react";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const deliveryStatusConfig = {
  WAITING_FOR_DRIVER: {
    label: "Menunggu Driver",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
  },
  ASSIGNED: {
    label: "Diterima — Jemput Sekarang",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  PICKED_UP: {
    label: "Dalam Perjalanan",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
  DELIVERED: {
    label: "Terkirim",
    color: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
};

const DriverJobsPage = () => {
  const [availableJobs, setAvailableJobs] = useState<Delivery[]>([]);
  const [myJobs, setMyJobs] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"available" | "my">("available");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchJobs = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const [available, my] = await Promise.all([
        driverService.getAvailableJobs(),
        driverService.getMyJobs(),
      ]);
      setAvailableJobs(available);
      setMyJobs(my);
    } catch {
      toast.error("Gagal memuat pekerjaan.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAccept = async (deliveryId: string) => {
    setActionLoading(deliveryId);
    try {
      await driverService.acceptJob(deliveryId);
      toast.success("🎉 Pekerjaan diterima! Segera menuju toko untuk penjemputan.");
      await fetchJobs(true);
      setActiveTab("my");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menerima pekerjaan.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePickUp = async (deliveryId: string) => {
    setActionLoading(deliveryId);
    try {
      await driverService.pickUpOrder(deliveryId);
      toast.success("📦 Penjemputan dikonfirmasi! Segera antar ke pembeli.");
      await fetchJobs(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal konfirmasi penjemputan.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (deliveryId: string) => {
    setActionLoading(deliveryId);
    try {
      await driverService.completeDelivery(deliveryId);
      toast.success("✅ Pengiriman selesai! Penghasilan sudah masuk ke wallet kamu 🎉");
      await fetchJobs(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyelesaikan pengiriman.");
    } finally {
      setActionLoading(null);
    }
  };

  const activeJobs = myJobs.filter((j) => ["ASSIGNED", "PICKED_UP"].includes(j.status));
  const completedJobs = myJobs.filter((j) => j.status === "DELIVERED");

  const renderJobCard = (job: Delivery, isMyJob = false) => {
    const statusConfig =
      deliveryStatusConfig[job.status] ?? deliveryStatusConfig.WAITING_FOR_DRIVER;

    return (
      <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
        {/* Status top strip */}
        <div className={`h-1 w-full ${statusConfig.dot}`} />
        <CardContent className="p-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                Order #{job.order.id.slice(0, 8).toUpperCase()}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center">
                  <Store className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="font-bold text-foreground text-base">
                  {job.order.store.name}
                </p>
              </div>
            </div>
            <Badge
              className={`${statusConfig.color} border font-semibold text-[11px] shrink-0 flex items-center gap-1.5`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse`} />
              {statusConfig.label}
            </Badge>
          </div>

          {/* Delivery Route */}
          <div className="bg-muted/40 rounded-xl p-3.5 mb-4">
            <div className="flex items-start gap-2.5">
              <div className="flex flex-col items-center gap-1 mt-0.5">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <Store className="w-3 h-3 text-orange-500" />
                </div>
                <div className="w-0.5 h-4 bg-border" />
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-blue-500" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">Jemput dari</p>
                  <p className="text-sm font-semibold text-foreground">{job.order.store.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">Antar ke</p>
                  <p className="text-sm font-semibold text-foreground">
                    {job.order.address.recipientName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {job.order.address.street}, {job.order.address.city},{" "}
                    {job.order.address.province}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    {job.order.address.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
            <div className="w-6 h-6 bg-muted rounded-lg flex items-center justify-center shrink-0">
              <Package className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">
              {job.order.items
                .slice(0, 2)
                .map((i) => `${i.productName} ×${i.quantity}`)
                .join(", ")}
              {job.order.items.length > 2 &&
                ` +${job.order.items.length - 2} item lagi`}
            </span>
          </div>

          {/* Footer: Fee + Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                Ongkos Antar
              </p>
              <p className="font-black text-xl text-green-600">
                {formatRupiah(Number(job.fee))}
              </p>
            </div>

            <div className="flex gap-2">
              {/* Available → Accept */}
              {!isMyJob && job.status === "WAITING_FOR_DRIVER" && (
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl px-5 h-10 shadow-sm"
                  disabled={actionLoading === job.id}
                  onClick={() => handleAccept(job.id)}
                >
                  {actionLoading === job.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Truck className="w-4 h-4 mr-2" />
                  )}
                  Ambil Job
                </Button>
              )}

              {/* My job ASSIGNED → Confirm Pickup */}
              {isMyJob && job.status === "ASSIGNED" && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-5 h-10 shadow-sm"
                  disabled={actionLoading === job.id}
                  onClick={() => handlePickUp(job.id)}
                >
                  {actionLoading === job.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Package className="w-4 h-4 mr-2" />
                  )}
                  Konfirmasi Pickup
                </Button>
              )}

              {/* My job PICKED_UP → Complete */}
              {isMyJob && job.status === "PICKED_UP" && (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-5 h-10 shadow-sm"
                  disabled={actionLoading === job.id}
                  onClick={() => handleComplete(job.id)}
                >
                  {actionLoading === job.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Selesai Antar
                </Button>
              )}

              {/* Delivered → Done badge */}
              {isMyJob && job.status === "DELIVERED" && (
                <div className="flex items-center gap-1.5 text-sm font-bold text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                  <CheckCircle className="w-4 h-4" />
                  Selesai ✓
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Mencari pekerjaan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Pekerjaan Pengiriman
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {availableJobs.length} pekerjaan tersedia · {myJobs.length} pekerjaan saya
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchJobs(true)}
          disabled={isRefreshing}
          className="rounded-xl"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Active job banner */}
      {activeJobs.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <div className="w-9 h-9 bg-yellow-200 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-yellow-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-yellow-800">Kamu punya pengiriman aktif!</p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Selesaikan pengiriman sekarang sebelum menerima pekerjaan baru.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("my")}
            className="text-yellow-700 hover:text-yellow-900 shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-muted/50 p-1 rounded-2xl mb-6 gap-1">
        {[
          { key: "available", label: "Pekerjaan Tersedia", count: availableJobs.length },
          { key: "my", label: "Pekerjaan Saya", count: myJobs.length },
        ].map((tab) => (
          <button
            key={tab.key}
            id={`driver-tab-${tab.key}`}
            onClick={() => setActiveTab(tab.key as "available" | "my")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === tab.key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.key
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Available Jobs */}
      {activeTab === "available" && (
        <div className="space-y-4">
          {availableJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-3xl flex items-center justify-center mb-4">
                <Truck className="w-10 h-10 text-yellow-400" />
              </div>
              <p className="font-bold text-foreground text-lg mb-1">
                Belum ada pekerjaan
              </p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Pekerjaan baru akan muncul ketika seller menandai pesanan siap dijemput.
              </p>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => fetchJobs(true)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          ) : (
            availableJobs.map((job) => renderJobCard(job, false))
          )}
        </div>
      )}

      {/* My Jobs */}
      {activeTab === "my" && (
        <div className="space-y-6">
          {/* Active Section */}
          {activeJobs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-sm font-bold text-foreground">
                  Aktif ({activeJobs.length})
                </p>
              </div>
              <div className="space-y-4">
                {activeJobs.map((job) => renderJobCard(job, true))}
              </div>
            </div>
          )}

          {/* Completed Section */}
          {completedJobs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-sm font-bold text-foreground">
                  Selesai ({completedJobs.length})
                </p>
              </div>
              <div className="space-y-4">
                {completedJobs.map((job) => renderJobCard(job, true))}
              </div>
            </div>
          )}

          {myJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="font-bold text-foreground mb-1">Belum ada pekerjaan</p>
              <p className="text-sm text-muted-foreground">
                Ambil pekerjaan dari tab "Tersedia" untuk mulai.
              </p>
              <Button
                className="mt-5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold"
                onClick={() => setActiveTab("available")}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Cari Pekerjaan
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverJobsPage;