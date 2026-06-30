import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { productService } from "../services/productService";
import { Product } from "../types/productTypes";
import ProductCard from "../components/product/ProductCard";
import {
  ShoppingBag,
  Shield,
  Truck,
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
  Anchor,
} from "lucide-react";

const features = [
  {
    icon: Anchor,
    title: "Direct Catch & Source",
    desc: "Premium seafood and ocean products sourced directly from local Indonesian fishers.",
  },
  {
    icon: Shield,
    title: "Secure SeaWallet",
    desc: "Every transaction is securely processed and protected by encrypted payments.",
  },
  {
    icon: Truck,
    title: "Express Deliveries",
    desc: "Real-time routing and temperature-controlled logistics for maximum freshness.",
  },
];

const categories = [
  { name: "Electronics", emoji: "📱", color: "from-blue-500/10 to-indigo-500/10" },
  { name: "Fashion", emoji: "👕", color: "from-pink-500/10 to-rose-500/10" },
  { name: "Food", emoji: "🍜", color: "from-amber-500/10 to-orange-500/10" },
  { name: "Books", emoji: "📚", color: "from-emerald-500/10 to-teal-500/10" },
  { name: "Sports", emoji: "⚽", color: "from-sky-500/10 to-cyan-500/10" },
  { name: "Beauty", emoji: "💄", color: "from-purple-500/10 to-fuchsia-500/10" },
  { name: "Home", emoji: "🏠", color: "from-red-500/10 to-orange-500/10" },
  { name: "Toys", emoji: "🧸", color: "from-yellow-500/10 to-amber-500/10" },
];

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await productService.getProducts({ page: 1, limit: 5 });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-950 bg-grid-pattern overflow-hidden py-24 md:py-32 text-white border-b border-slate-900">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left animate-fade-up">
              <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-orange-400" /> COMPFEST 18 SEA Academy
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Premium Marketplace <br />
                <span className="text-gradient">Ocean to Doorstep</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                Indonesia's premier decentralized marketplace. Discover freshly sourced catches, local products, and secure trading with integrated wallet tracking.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold shadow-lg shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Link to="/products" className="flex items-center gap-2">
                    Browse Catalog <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-slate-800 text-slate-200 hover:bg-slate-900 rounded-full font-semibold bg-transparent"
                >
                  <Link to="/register">Open Shop</Link>
                </Button>
              </div>

              {/* Stats Chips */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-900 max-w-lg">
                {[
                  { value: "10K+", label: "Products Listed" },
                  { value: "5K+", label: "Trusted Fishers" },
                  { value: "99.8%", label: "Safe Deliveries" },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/40 backdrop-blur-sm border border-slate-900 p-3.5 rounded-2xl">
                    <p className="text-xl sm:text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-slate-400 text-xs mt-1 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Card Preview */}
            <div className="lg:col-span-5 hidden lg:block animate-float">
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden border-white/10 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                      <Anchor className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-sm font-bold text-white">Live Catch Preview</span>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[10px] uppercase font-bold tracking-wider">
                    Fresh
                  </Badge>
                </div>

                {/* Decorative Fish Image/Vector */}
                <div className="bg-slate-950/80 aspect-video rounded-2xl mb-4 overflow-hidden border border-slate-900 flex items-center justify-center">
                  <div className="text-center p-4">
                    <ShoppingBag className="w-12 h-12 text-slate-800 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Premium Seafood Selection</p>
                  </div>
                </div>

                {/* Details */}
                <h3 className="font-bold text-lg text-white mb-1">Giant Tiger Prawns (Grade A)</h3>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-500">Freshly caught today</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-slate-300 font-semibold">4.9</span>
                      <span className="text-xs text-slate-500">(148 reviews)</span>
                    </div>
                  </div>
                  <p className="text-xl font-black text-orange-500">Rp 120.000<span className="text-xs text-slate-400 font-normal"> / kg</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Explore Categories</h2>
            <p className="text-sm text-muted-foreground mt-1">Browse quality collections curated by our merchants.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name.toLowerCase()}`}
              className="flex flex-col items-center gap-3 p-4 bg-card rounded-2xl border border-border/80 hover:border-orange-500 hover:shadow-md transition-all duration-300 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110`}>
                {cat.emoji}
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-orange-500 font-semibold text-center transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Showcase */}
      <section className="bg-muted/40 py-16 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-foreground">Why SEAPEDIA?</h2>
            <p className="text-sm text-muted-foreground mt-2">Connecting local seafood farmers to direct consumers with cutting-edge tech.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="border border-border/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto border border-orange-500/20">
                    <feature.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" /> Featured Selections
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Freshly updated catches and seasonal premium items.</p>
          </div>
          <Button variant="ghost" asChild className="text-orange-500 hover:text-orange-600 font-bold">
            <Link to="/products">
              See all catalog <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Dynamic products loader */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse border-border/60">
                <CardContent className="p-0">
                  <div className="bg-muted aspect-square w-full rounded-t-2xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-3.5 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-orange-100 rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-3xl text-center bg-muted/20">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">No featured items available</p>
            <p className="text-xs text-muted-foreground mt-1">Please seed the database or check back later.</p>
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

export default HomePage;