import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeService } from "../../services/storeService";
import { Store } from "../../types/storeTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Store as StoreIcon,
  Package,
  Plus,
  ExternalLink,
  Settings,
  ShoppingBag,
  TrendingUp,
  ChevronRight,
  Edit,
  Eye,
  Star,
  Loader2,
} from "lucide-react";

const MyStorePage = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await storeService.getMyStore();
        setStore(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          navigate("/seller/create-store");
        } else {
          toast.error("Gagal memuat data toko.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchStore();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Memuat toko kamu...</p>
      </div>
    );
  }

  if (!store) return null;

  const stats = [
    {
      label: "Total Produk",
      value: store.products?.length ?? 0,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      path: null,
    },
    {
      label: "Total Pesanan",
      value: 0,
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      path: "/seller/orders",
    },
    {
      label: "Rating Toko",
      value: "4.8",
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      path: null,
    },
    {
      label: "Status",
      value: store.isActive ? "Aktif" : "Nonaktif",
      icon: TrendingUp,
      color: store.isActive ? "text-green-600" : "text-red-500",
      bg: store.isActive ? "bg-green-50" : "bg-red-50",
      border: store.isActive ? "border-green-100" : "border-red-100",
      path: null,
    },
  ];

  const quickActions = [
    {
      label: "Tambah Produk",
      desc: "Daftarkan produk baru ke toko",
      icon: Plus,
      color: "bg-orange-500 hover:bg-orange-600",
      path: "/seller/products/create",
    },
    {
      label: "Kelola Pesanan",
      desc: "Lihat & proses pesanan masuk",
      icon: ShoppingBag,
      color: "bg-blue-500 hover:bg-blue-600",
      path: "/seller/orders",
    },
    {
      label: "Laporan",
      desc: "Analisis penjualan toko",
      icon: TrendingUp,
      color: "bg-green-500 hover:bg-green-600",
      path: "/seller/reports",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Store Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 rounded-3xl p-8 text-white shadow-xl">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-28 h-28 bg-white/5 rounded-full translate-y-1/2" />

        {/* Store icon decoration */}
        <div className="absolute right-8 bottom-6 opacity-10">
          <StoreIcon className="w-28 h-28 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex items-start gap-5">
              {/* Logo */}
              <div className="w-18 h-18 shrink-0">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                  {store.logoUrl ? (
                    <img
                      src={store.logoUrl}
                      alt={store.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <StoreIcon className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-white/20 text-white border-white/30 text-[10px] font-bold">
                    {store.isActive ? "🟢 Aktif" : "🔴 Nonaktif"}
                  </Badge>
                </div>
                <h1 className="text-2xl font-black tracking-tight">{store.name}</h1>
                <p className="text-green-100 text-sm mt-0.5">
                  seapedia.com/store/{store.slug}
                </p>
                {store.description && (
                  <p className="text-green-100/80 text-sm mt-2 max-w-md line-clamp-2">
                    {store.description}
                  </p>
                )}
              </div>
            </div>

            {/* Store action buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent rounded-xl"
                onClick={() => navigate(`/store/${store.slug}`)}
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Lihat Toko
              </Button>
              <Button
                size="sm"
                className="bg-white text-green-600 hover:bg-green-50 rounded-xl font-bold shadow-sm"
                onClick={() => navigate("/seller/store/settings")}
              >
                <Settings className="w-4 h-4 mr-1.5" />
                Pengaturan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`border ${stat.border} hover:shadow-md transition-shadow ${stat.path ? "cursor-pointer" : ""}`}
            onClick={() => stat.path && navigate(stat.path)}
          >
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              <p className={`font-black text-xl mt-0.5 ${stat.color}`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-4 p-4 rounded-2xl text-white font-bold text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${action.color}`}
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold">{action.label}</p>
              <p className="text-xs opacity-80 mt-0.5">{action.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 ml-auto opacity-70" />
          </button>
        ))}
      </div>

      {/* Products Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            Produk Saya
          </CardTitle>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 rounded-xl font-bold"
            onClick={() => navigate("/seller/products/create")}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Produk
          </Button>
        </CardHeader>
        <CardContent>
          {!store.products || store.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-orange-300" />
              </div>
              <p className="font-bold text-foreground text-lg mb-1">Belum ada produk</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Tambahkan produk pertama kamu untuk mulai berjualan di Seapedia.
              </p>
              <Button
                className="bg-orange-500 hover:bg-orange-600 rounded-xl font-bold px-6"
                onClick={() => navigate("/seller/products/create")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk Pertama
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {store.products.map((product) => (
                <div
                  key={product.id}
                  className="border border-border/60 rounded-2xl overflow-hidden hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => navigate(`/seller/products/${product.id}`)}
                >
                  {/* Product Image */}
                  <div className="bg-muted h-36 flex items-center justify-center overflow-hidden relative">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Package className="w-10 h-10 text-muted-foreground/30" />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-1.5">
                        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Eye className="w-3.5 h-3.5 text-gray-700" />
                        </div>
                        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Edit className="w-3.5 h-3.5 text-gray-700" />
                        </div>
                      </div>
                    </div>
                    {/* Stock badge */}
                    {product.stock <= 5 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        Stok Hampir Habis
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                    <p className="text-sm font-black text-orange-500 mt-1">
                      Rp {Number(product.price).toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-[10px] text-muted-foreground">
                        Stok: <span className={product.stock <= 5 ? "text-red-500 font-bold" : "font-semibold"}>{product.stock}</span>
                      </p>
                      <div className={`w-1.5 h-1.5 rounded-full ${product.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                    </div>
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

export default MyStorePage;