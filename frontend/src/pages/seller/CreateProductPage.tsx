import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { Category } from "../../types/productTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Package } from "lucide-react";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    weight: "",
    categoryId: "",
  });
  const [images, setImages] = useState([{ url: "", isPrimary: true }]);

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (index: number, url: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, url } : img))
    );
  };

  const addImage = () => {
    if (images.length >= 5) {
      toast.error("Maximum 5 images allowed.");
      return;
    }
    setImages((prev) => [...prev, { url: "", isPrimary: false }]);
  };

  const removeImage = (index: number) => {
    if (images.length === 1) {
      toast.error("At least one image is required.");
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validImages = images.filter((img) => img.url.trim() !== "");
    if (validImages.length === 0) {
      toast.error("Please add at least one product image URL.");
      return;
    }

    setIsLoading(true);
    try {
      await productService.createProduct({
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
        weight: Number(form.weight),
        categoryId: form.categoryId,
        images: validImages,
      });
      toast.success("Product created successfully! 🎉");
      navigate("/seller/store");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <Package className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Add New Product</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to list your product.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Product Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Earbuds Pro"
                required
                minLength={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your product..."
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (Rp)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="50000"
                  required
                  min={1}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="100"
                  required
                  min={0}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weight">Weight (grams)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
                placeholder="500"
                required
                min={1}
              />
              <p className="text-xs text-muted-foreground">
                Used to calculate delivery fee.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {images.map((img, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Image URL ${index + 1}${index === 0 ? " (primary)" : ""}`}
                  value={img.url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-red-400 hover:text-red-600 p-1 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImage}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Image URL
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Paste direct image URLs. First image will be the primary display image.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/seller/store")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            {isLoading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;