import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { driverService } from "../../services/driverService";
import { DriverEarnings } from "../../types/driverTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Truck,
  DollarSign,
  CheckCircle,
  Wallet,
  ArrowRight,
  Loader2,
  TrendingUp,
  Zap,
  MapPin,
  Clock,
} from "lucide-react";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const DriverDashboardPage = () => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState<DriverEarnings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    driverService
      .getEarnings()
      .then(setEarnings)
      .catch(() => toast.error("Gagal memuat data earnings."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Memuat dashboard driver...
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Penghasilan",
      value: formatRupiah(earnings?.totalEarnings ?? 0),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      label: "Saldo Wallet",
      value: formatRupiah(earnings?.balance ?? 0),
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Pengiriman Selesai",
      value: earnings?.completedDeliveries ?? 0,
      icon: CheckCircle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
    {
      label: "Status",
      value: isOnline ? "Online" : "Offline",
      icon: Zap,
      color: isOnline ? "text-green-600" : "text-gray-500",
      bg: isOnline ? "bg-green-50" : "bg-gray-50",
      border: isOnline ? "border-green-100" : "border-gray-100",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute right-6 bottom-4 opacity-10">
          <Truck className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOnline ? "bg-green-300 animate-pulse" : "bg-white/40"
                  }`}
                />
                <span className="text-xs font-bold text-yellow-100">
                  {isOnline ? "Kamu sedang Online" : "Kamu sedang Offline"}
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                Driver Dashboard
              </h1>
              <p className="text-yellow-100 text-sm mt-1">
                Antar pesanan, dapatkan penghasilan 🚀
              </p>
            </div>

            {/* Online/Offline Toggle */}
            <button
              onClick={() => {
                setIsOnline((v) => !v);
                toast.success(
                  isOnline
                    ? "Kamu sekarang Offline"
                    : "Kamu sekarang Online — siap menerima job!"
                );
              }}
              className={`px-5 py-2.5 rounded-full font-bold text-sm border-2 transition-all ${
                isOnline
                  ? "bg-white/20 border-white/40 text-white hover:bg-white/30"
                  : "bg-white text-orange-600 border-white hover:bg-orange-50"
              }`}
            >
              {isOnline ? "⏸ Offline" : "▶ Online"}
            </button>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate("/driver/jobs")}
            className="bg-white text-orange-600 hover:bg-orange-50 font-black rounded-full px-6 py-3 shadow-lg"
            size="lg"
            disabled={!isOnline}
          >
            <MapPin className="w-5 h-5 mr-2" />
            Cari Pekerjaan
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {!isOnline && (
            <p className="text-yellow-200 text-xs mt-2">
              Aktifkan status Online untuk menerima job
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/driver/jobs")}
          className="flex items-center gap-4 p-5 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold">Lihat Available Jobs</p>
            <p className="text-xs opacity-80 mt-0.5">
              Ambil delivery job yang tersedia
            </p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto opacity-70" />
        </button>

        <button
          onClick={() => navigate("/wallet")}
          className="flex items-center gap-4 p-5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold">Lihat Wallet</p>
            <p className="text-xs opacity-80 mt-0.5">
              Saldo & riwayat penghasilan
            </p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto opacity-70" />
        </button>
      </div>

      {/* Recent Earnings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow-500" />
            Riwayat Penghasilan Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!earnings?.recentEarnings.length ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-3">
                <Truck className="w-8 h-8 text-yellow-300" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                Belum ada penghasilan
              </p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Terima delivery job pertama untuk mulai menghasilkan.
              </p>
              <Button
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 rounded-xl font-bold"
                onClick={() => navigate("/driver/jobs")}
              >
                Cari Job Sekarang
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {earnings.recentEarnings.map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      Penghasilan Pengiriman
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {earning.description}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(earning.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <p className="text-sm font-black text-green-600 shrink-0">
                    +{formatRupiah(Number(earning.amount))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboardPage;