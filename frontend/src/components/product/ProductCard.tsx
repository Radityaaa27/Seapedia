import { Link } from "react-router-dom";
import { Product } from "../../types/productTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : null;

  return (
    <Link to={`/products/${product.store?.slug}/${product.slug}`}>
      <Card className="group cursor-pointer hover:shadow-md transition-all duration-200 overflow-hidden border-border h-full">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Image */}
          <div className="relative bg-muted h-44 overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-muted-foreground/20" />
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 flex flex-col flex-1">
            <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug mb-1">
              {product.name}
            </p>

            <p className="text-base font-bold text-orange-500 mt-auto">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>

            <div className="flex items-center justify-between mt-2">
              {avgRating ? (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {avgRating.toFixed(1)} ({product.reviews?.length})
                  </span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">No reviews</span>
              )}
              <span className="text-xs text-muted-foreground truncate max-w-20">
                {product.store?.name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;