import { Category } from "../../types/productTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  search: string;
  onCategoryChange: (id: string) => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

const ProductFilters = ({
  categories,
  selectedCategory,
  search,
  onCategoryChange,
  onSearchChange,
  onClear,
}: ProductFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Categories</p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedCategory === "" ? "default" : "outline"}
            onClick={() => onCategoryChange("")}
            className={selectedCategory === "" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => onCategoryChange(cat.id)}
              className={selectedCategory === cat.id ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              {cat.iconUrl && (
                <span className="mr-1">{cat.iconUrl}</span>
              )}
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {(search || selectedCategory) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground"
        >
          <X className="w-3 h-3 mr-1" /> Clear filters
        </Button>
      )}
    </div>
  );
};

export default ProductFilters;