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
    <Link to={`/products/${product.store?.slug}/${product.slug}`} className="block h-full group">
      <Card className="cursor-pointer border border-border/60 hover:border-orange-500/30 rounded-2xl overflow-hidden h-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col bg-card">
        <CardContent className="p-0 flex flex-col h-full flex-1">
          {/* Image Container */}
          <div className="relative bg-muted/40 aspect-square overflow-hidden border-b border-border/50 flex items-center justify-center p-3 bg-grid-pattern">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-muted-foreground/15 transition-transform duration-300 group-hover:scale-110" />
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center">
                <Badge variant="destructive" className="font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Info Block */}
          <div className="p-3.5 flex flex-col flex-grow justify-between gap-2.5">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider">
                {product.store?.name}
              </span>
              <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
                {product.name}
              </h4>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-black text-orange-500">
                Rp {Number(product.price).toLocaleString("id-ID")}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                {avgRating ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {avgRating.toFixed(1)} <span className="text-muted-foreground/50 font-normal">({product.reviews?.length})</span>
                    </span>
                  </div>
                ) : (
                  <span className="text-[9px] text-muted-foreground/60 font-medium">No reviews</span>
                )}
                
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-orange-500/5 text-orange-600 border border-orange-500/10">
                  Buy →
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;