import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Shield,
  Truck,
  Star,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    title: "Wide Selection",
    desc: "Thousands of products from trusted sellers across Indonesia.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "Your wallet and transactions are always protected.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Real-time tracking with our driver network.",
  },
];

const categories = [
  { name: "Electronics", emoji: "📱" },
  { name: "Fashion", emoji: "👕" },
  { name: "Food", emoji: "🍜" },
  { name: "Books", emoji: "📚" },
  { name: "Sports", emoji: "⚽" },
  { name: "Beauty", emoji: "💄" },
  { name: "Home", emoji: "🏠" },
  { name: "Toys", emoji: "🧸" },
];

const HomePage = () => {
  return (
    <div className="pb-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <Badge className="bg-orange-400 text-white border-none mb-4 text-xs">
              <Zap className="w-3 h-3 mr-1" /> COMPFEST 18 Marketplace
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Everything You Need,{" "}
              <span className="text-orange-200">One Place</span>
            </h1>
            <p className="text-lg text-orange-100 mb-8 leading-relaxed">
              Indonesia's trusted marketplace. Find anything you need,
              sell what you love, deliver with confidence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 rounded-full font-semibold"
              >
                <Link to="/products">
                  Browse Products <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600 rounded-full font-semibold bg-transparent"
              >
                <Link to="/register">Start Selling</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              {[
                { value: "10K+", label: "Products" },
                { value: "5K+", label: "Sellers" },
                { value: "50K+", label: "Buyers" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-orange-200 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Browse Categories
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name.toLowerCase()}`}
              className="flex flex-col items-center gap-2 p-3 bg-background rounded-xl border border-border hover:border-orange-500 hover:shadow-sm transition-all group"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs text-muted-foreground group-hover:text-orange-500 font-medium text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-foreground text-center mb-8">
            Why SEAPEDIA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dummy featured products placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Featured Products</h2>
          <Button variant="ghost" asChild className="text-orange-500">
            <Link to="/products">
              See all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Placeholder cards — real products come in Phase 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="group cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="bg-muted h-40 rounded-t-xl flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <div className="p-3">
                  <div className="h-3 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-3" />
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-muted-foreground">4.8</span>
                  </div>
                  <div className="h-4 bg-orange-100 rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;