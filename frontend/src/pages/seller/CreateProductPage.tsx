import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { Category } from "../../types/productTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Package,
  Image as ImageIcon,
  AlertCircle,
  ChevronLeft,
  Star,
} from "lucide-react";

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
      toast.error("Maksimum 5 gambar diperbolehkan.");
      return;
    }
    setImages((prev) => [...prev, { url: "", isPrimary: false }]);
  };

  const removeImage = (index: number) => {
    if (images.length === 1) {
      toast.error("Minimal satu gambar harus ada.");
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validImages = images.filter((img) => img.url.trim() !== "");
    if (validImages.length === 0) {
      toast.error("Tambahkan setidaknya satu URL gambar produk.");
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
      toast.success("🎉 Produk berhasil ditambahkan!");
      navigate("/seller/store");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal membuat produk.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if primary image URL is valid for preview
  const primaryImageUrl = images[0]?.url;
  const hasPrimaryImage = primaryImageUrl && primaryImageUrl.startsWith("http");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Back button + Header */}
      <div className="mb-7">
        <button
          onClick={() => navigate("/seller/store")}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-medium mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Toko
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground">Tambah Produk Baru</h1>
            <p className="text-sm text-muted-foreground">
              Isi detail produk yang ingin kamu jual.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Product Image Preview Card */}
        <Card className="border-border/60 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-44 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden relative">
              {hasPrimaryImage ? (
                <img
                  src={primaryImageUrl}
                  alt="Preview gambar utama"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="w-12 h-12 opacity-25" />
                  <p className="text-xs font-medium">Preview gambar utama akan tampil di sini</p>
                </div>
              )}
              {hasPrimaryImage && (
                <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                  Gambar Utama
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" />
              Informasi Produk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="prod-name" className="text-sm font-semibold">
                Nama Produk <span className="text-red-500">*</span>
              </Label>
              <Input
                id="prod-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Udang Segar 500g"
                required
                minLength={3}
                className="rounded-xl border-border/60 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-desc" className="text-sm font-semibold">
                Deskripsi{" "}
                <span className="text-muted-foreground font-normal">(opsional)</span>
              </Label>
              <textarea
                id="prod-desc"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Ceritakan detail produkmu — ukuran, kondisi, keunggulan, dll."
                className="w-full px-3 py-2.5 border border-input rounded-xl text-sm bg-background focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-category" className="text-sm font-semibold">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <select
                id="prod-category"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-input rounded-xl text-sm bg-background focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="">Pilih kategori produk</option>
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
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold">Harga & Inventaris</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prod-price" className="text-sm font-semibold">
                  Harga (Rp) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">
                    Rp
                  </span>
                  <Input
                    id="prod-price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="50000"
                    required
                    min={1}
                    className="pl-10 rounded-xl border-border/60 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prod-stock" className="text-sm font-semibold">
                  Stok <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="prod-stock"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="100"
                  required
                  min={0}
                  className="rounded-xl border-border/60 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-weight" className="text-sm font-semibold">
                Berat (gram) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="prod-weight"
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
                placeholder="500"
                required
                min={1}
                className="rounded-xl border-border/60 focus:border-orange-500"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3" />
                Berat digunakan untuk menghitung ongkos kirim.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              <span>Gambar Produk</span>
              <span className="text-muted-foreground font-normal text-xs">
                {images.length}/5 gambar
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {images.map((img, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  {/* Thumbnail preview */}
                  <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-border/60">
                    {img.url && img.url.startsWith("http") ? (
                      <img
                        src={img.url}
                        alt={`Gambar ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "";
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <Input
                    placeholder={`URL Gambar ${index + 1}${index === 0 ? " (utama)" : ""}`}
                    value={img.url}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 rounded-xl border-border/60 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-muted-foreground hover:text-red-500 p-1.5 shrink-0 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {index === 0 && (
                  <div className="flex items-center gap-1.5 ml-12">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-400" />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Gambar utama (tampil pertama di toko)
                    </span>
                  </div>
                )}
              </div>
            ))}

            {images.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImage}
                className="w-full border-dashed rounded-xl border-border/60 hover:border-orange-400 hover:text-orange-500"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Tambah Gambar
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Paste URL gambar langsung (https://...). Gambar pertama akan jadi tampilan utama produk.
            </p>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 pb-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => navigate("/seller/store")}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1.5" />
                Tambah Produk
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;