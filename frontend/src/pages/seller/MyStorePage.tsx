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
        // 404 means no store yet
        if (err.response?.status === 404) {
          navigate("/seller/create-store");
        } else {
          toast.error("Failed to load store.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchStore();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground text-sm">Loading your store...</div>
      </div>
    );
  }

  if (!store) return null;

  const stats = [
    {
      label: "Products",
      value: store.products?.length ?? 0,
      icon: Package,
      color: "text-blue-500",
    },
    {
      label: "Orders",
      value: 0,
      icon: ShoppingBag,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Store header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              {store.logoUrl ? (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <StoreIcon className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{store.name}</h1>
                <Badge className="bg-white/20 text-white border-none text-xs">
                  {store.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-green-100 text-sm mt-0.5">
                seapedia.com/store/{store.slug}
              </p>
              {store.description && (
                <p className="text-green-100 text-sm mt-1 max-w-md">
                  {store.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              onClick={() => navigate(`/store/${store.slug}`)}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View Store
            </Button>
            <Button
              size="sm"
              className="bg-white text-green-600 hover:bg-green-50"
              onClick={() => navigate("/seller/store/settings")}
            >
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="font-bold text-foreground text-lg">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">My Products</CardTitle>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => navigate("/seller/products/create")}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Product
          </Button>
        </CardHeader>
        <CardContent>
          {!store.products || store.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No products yet.</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Add your first product to start selling.
              </p>
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => navigate("/seller/products/create")}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {store.products.map((product) => (
                <div
                  key={product.id}
                  className="border border-border rounded-xl overflow-hidden hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => navigate(`/seller/products/${product.id}`)}
                >
                  <div className="bg-muted h-32 flex items-center justify-center">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-orange-500 font-semibold mt-1">
                      Rp {Number(product.price).toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Stock: {product.stock}
                    </p>
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