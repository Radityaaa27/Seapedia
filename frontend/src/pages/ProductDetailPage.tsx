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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-4 text-muted-foreground"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

        {/* Images */}
        <div>
          <div className="bg-muted rounded-2xl overflow-hidden h-80 md:h-96 mb-3">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage].url}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground/20" />
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-orange-500"
                      : "border-border hover:border-orange-300"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <Badge variant="outline" className="mb-2 text-xs">
            {product.category.name}
          </Badge>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {product.name}
          </h1>

          {avgRating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(avgRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({product.reviews?.length} reviews)
              </span>
            </div>
          )}

          <p className="text-3xl font-bold text-orange-500 mb-4">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </p>

          {/* Stock & Weight */}
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Weight className="w-4 h-4" />
              <span>{product.weight}g</span>
            </div>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Quantity selector */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium">Qty:</span>
            <div className="flex items-center border border-input rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 hover:bg-muted transition-colors text-sm"
              >
                −
              </button>
              <span className="px-4 py-1.5 text-sm font-medium border-x border-input">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                disabled={product.stock === 0}
                className="px-3 py-1.5 hover:bg-muted transition-colors text-sm disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

<Button
  className="w-full bg-orange-500 hover:bg-orange-600 mb-3"
  disabled={product.stock === 0}
  onClick={handleAddToCart}
>
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>

          {/* Store info */}
          {product.store && (
            <Card
              className="cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => navigate(`/store/${product.store!.slug}`)}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{product.store.name}</p>
                  <p className="text-xs text-muted-foreground">View Store →</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Customer Reviews
          </h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center shrink-0 text-orange-600 font-bold text-sm">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {review.user.name}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
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