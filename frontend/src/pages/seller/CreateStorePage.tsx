import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeService } from "../../services/storeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Store, ArrowRight } from "lucide-react";

const CreateStorePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // Auto-generate slug from store name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
    setForm((prev) => ({ ...prev, name, slug }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await storeService.createStore(form);
      toast.success("Store created successfully! 🎉");
      navigate("/seller/store");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create store.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Store className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Open Your Store</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Set up your store and start selling on SEAPEDIA.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Store Details</CardTitle>
            <CardDescription>
              Your store name and slug cannot be changed after creation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-1.5">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="Budi's Electronics"
                  required
                  minLength={3}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  Must be unique across all SEAPEDIA stores.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">Store URL</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    seapedia.com/store/
                  </span>
                  <Input
                    id="slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="budis-electronics"
                    required
                    minLength={3}
                    maxLength={50}
                    pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    title="Lowercase letters, numbers, and hyphens only"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, and hyphens only.
                </p>
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
                  placeholder="Tell buyers what your store is about..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none transition-colors"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {form.description.length}/500
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  "Creating store..."
                ) : (
                  <>
                    Create Store <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateStorePage;