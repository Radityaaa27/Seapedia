import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { useCart } from "../hooks/useCart";
import { Product } from "../types/productTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Star,
  Store,
  ShoppingCart,
  Package,
  Weight,
  ChevronLeft,
  Loader2,
  ArrowRight,
} from "lucide-react";

const ProductDetailPage = () => {
  const { storeSlug, productSlug } = useParams<{
    storeSlug: string;
    productSlug: string;
  }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      if (!storeSlug || !productSlug) return;
      try {
        const data = await productService.getProductBySlug(storeSlug, productSlug);
        setProduct(data);
      } catch {
        toast.error("Product not found.");
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [storeSlug, productSlug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!product) return null;

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : null;

    const handleAddToCart = async () => {
  try {
    await addItem(product!.id, quantity);
    toast.success("Added to cart!");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to add to cart.");
  }
};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-up">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-6 text-muted-foreground hover:text-orange-500 hover:bg-orange-500/5 transition-all rounded-lg"
      >
        <ChevronLeft className="w-4 h-4 mr-1.5" /> Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        {/* Images Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-card rounded-2xl overflow-hidden aspect-square border border-border/60 shadow-sm relative group flex items-center justify-center p-6 bg-grid-pattern">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage].url}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground/15" />
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                <Badge variant="destructive" className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-orange-500 shadow-md scale-[1.02]"
                      : "border-border hover:border-orange-300 hover:scale-[1.01]"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/15 border-none px-3 py-1 font-semibold rounded-full text-xs">
              {product.category.name}
            </Badge>
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight">
              {product.name}
            </h1>

            {avgRating && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(avgRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  {avgRating.toFixed(1)} <span className="text-muted-foreground/60 font-normal">({product.reviews?.length} verified reviews)</span>
                </span>
              </div>
            )}
          </div>

          <div className="py-4 border-y border-border/60">
            <p className="text-3xl font-black text-orange-500">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>
          </div>

          {/* Specs List */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 px-3.5 py-2 bg-muted/40 rounded-xl border border-border/40">
              <Package className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-foreground">
                {product.stock > 0 ? `${product.stock} units available` : "Sold out"}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 bg-muted/40 rounded-xl border border-border/40">
              <Weight className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-foreground">{product.weight} grams</span>
            </div>
          </div>

          {product.description && (
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Product Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="space-y-4 pt-4 border-t border-border/60">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-xl overflow-hidden shadow-sm bg-background">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 hover:bg-muted text-sm font-bold transition-colors"
                >
                  −
                </button>
                <span className="px-5 py-2 text-sm font-bold border-x border-border min-w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={product.stock === 0}
                  className="px-3.5 py-2 hover:bg-muted text-sm font-bold transition-colors disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-6 font-bold shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-300"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2.5" />
              {product.stock === 0 ? "Out of Stock" : "Add to Shopping Cart"}
            </Button>
          </div>

          {/* Store Info Card */}
          {product.store && (
            <Card
              className="cursor-pointer hover:shadow-md transition-all duration-300 hover:border-orange-500/30 overflow-hidden border-border/60"
              onClick={() => navigate(`/store/${product.store!.slug}`)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0 border border-orange-500/25">
                    <Store className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Sold & Shipped By</p>
                    <p className="text-sm font-bold text-foreground">{product.store.name}</p>
                  </div>
                </div>
                <div className="text-xs font-bold text-orange-500 flex items-center gap-1">
                  Visit Store <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews Tab */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-border/60">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              Verified Customer Reviews
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Read honest feedback from verified buyers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((review) => (
              <Card key={review.id} className="border border-border/60 hover:shadow-sm transition-all duration-300">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center shrink-0 text-orange-600 font-black text-sm border border-orange-500/20">
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{review.user.name}</p>
                        <p className="text-[10px] text-muted-foreground">Verified Buyer</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-xl border border-border/40">
                      "{review.comment}"
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;