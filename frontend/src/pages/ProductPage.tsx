import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../services/productService";
import { Product, Category } from "../types/productTypes";
import ProductCard from "../components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, PackageX, Search, X } from "lucide-react";

const categoryIcons: Record<string, string> = {
  "Electronics": "https://img.icons8.com/fluency/32/smartphone.png",
  "Fashion": "https://img.icons8.com/fluency/32/t-shirt.png",
  "Food & Beverage": "https://img.icons8.com/fluency/32/noodles.png",
  "Books": "https://img.icons8.com/fluency/32/books.png",
  "Sports": "https://img.icons8.com/fluency/32/football.png",
  "Beauty": "https://img.icons8.com/fluency/32/lipstick.png",
  "Home & Living": "https://img.icons8.com/fluency/32/home.png",
  "Toys": "https://img.icons8.com/fluency/32/teddy-bear.png",
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productService.getProducts({
        page,
        limit: 20,
        ...(search && { search }),
        ...(selectedCategory && { categoryId: selectedCategory }),
      });
      setProducts(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Sync URL params → local state when URL changes (e.g. from Navbar search)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "";
    setSearch(urlSearch);
    setSelectedCategory(urlCategory);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCategory]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set("search", value);
      else next.delete("search");
      return next;
    });
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
    setPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (id) next.set("category", id);
      else next.delete("category");
      return next;
    });
  };

  const handleClear = () => {
    setSearch("");
    setSelectedCategory("");
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <h1 className="text-2xl font-bold text-foreground mb-6">All Products</h1>

      {/* Search bar — single one, Navbar search feeds into this via URL */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 pr-9 rounded-full border-input"
        />
        {search && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter pills with CDN icons */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-foreground mb-3">Categories</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange("")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedCategory === ""
                ? "bg-orange-500 text-white border-orange-500"
                : "border-border text-muted-foreground hover:border-orange-400 hover:text-orange-500 bg-background"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === cat.id
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-border text-muted-foreground hover:border-orange-400 hover:text-orange-500 bg-background"
              }`}
            >
              {categoryIcons[cat.name] ? (
                <img
                  src={categoryIcons[cat.name]}
                  alt={cat.name}
                  className="w-4 h-4 object-contain"
                />
              ) : (
                <span className="w-4 h-4 rounded-full bg-orange-100 inline-block" />
              )}
              {cat.name}
            </button>
          ))}
        </div>

        {(search || selectedCategory) && (
          <button
            onClick={handleClear}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear all filters
          </button>
        )}
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-2xl bg-muted/20">
          <PackageX className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground font-medium">No products found.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleClear}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;