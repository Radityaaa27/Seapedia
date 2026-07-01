import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storeService } from "../services/storeService";
import { Store } from "../types/storeTypes";
import { Product } from "../types/productTypes";
import ProductCard from "../components/product/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store as StoreIcon, Package, ArrowLeft, ShoppingBag } from "lucide-react";

const StoreDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchStore = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await storeService.getStoreBySlug(slug);
        setStore(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Store not found.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStore();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-6">
        <div className="h-40 bg-muted rounded-3xl" />
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <StoreIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-foreground">Store not found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          {error || "This store may have been removed or does not exist."}
        </p>
        <Link to="/products" className="text-orange-500 font-bold text-sm inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to catalog
        </Link>
      </div>
    );
  }

  // Adapt the lightweight StoreProduct shape into what ProductCard expects
  const products: Product[] = (store.products || []).map((p) => ({
    id: p.id,
    storeId: store.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    stock: p.stock,
    weight: 0,
    isActive: p.isActive,
    category: { id: "", name: "", slug: "" },
    images: p.images.map((img, idx) => ({
      id: String(idx),
      url: img.url,
      isPrimary: img.isPrimary,
      order: idx,
    })),
    store: { id: store.id, name: store.name, slug: store.slug, logoUrl: store.logoUrl },
    createdAt: store.createdAt,
  }));

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Store Banner */}
      <section className="relative bg-slate-950 border-b border-slate-900 overflow-hidden">
        {store.bannerUrl ? (
          <img
            src={store.bannerUrl}
            alt={store.name}
            className="w-full h-40 sm:h-56 object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-40 sm:h-56 bg-gradient-to-br from-slate-900 to-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-14 pb-6">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-slate-900 border-4 border-background flex items-center justify-center overflow-hidden shadow-xl shrink-0">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <StoreIcon className="w-10 h-10 text-orange-500" />
              )}
            </div>
            <div className="pb-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{store.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold uppercase tracking-wide">
                  Official Store
                </Badge>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" /> {products.length} products
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {store.description && (
          <Card className="border border-border/60 rounded-2xl mb-10">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{store.description}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Products from {store.name}</h2>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-3xl text-center bg-muted/20">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">
              This store has no active products yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StoreDetailPage;