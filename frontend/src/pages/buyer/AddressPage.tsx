import { useState, useEffect } from "react";
import { addressService } from "../../services/addressService";
import { Address, AddressInput } from "../../types/addressTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MapPin,
  Plus,
  Trash2,
  Star,
  X,
  Loader2,
} from "lucide-react";

const EMPTY_FORM: AddressInput = {
  label: "",
  recipientName: "",
  phone: "",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  isDefault: false,
};

const AddressPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<AddressInput>(EMPTY_FORM);

  const fetchAddresses = async () => {
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch {
      toast.error("Failed to load addresses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await addressService.updateAddress(editingId, form);
        toast.success("Address updated.");
      } else {
        await addressService.createAddress(form);
        toast.success("Address added.");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      await fetchAddresses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save address.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (address: Address) => {
    setForm({
      label: address.label,
      recipientName: address.recipientName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await addressService.deleteAddress(id);
      toast.success("Address deleted.");
      await fetchAddresses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete address.");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressService.setDefault(id);
      toast.success("Default address updated.");
      await fetchAddresses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to set default.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Addresses</h1>
        <Button
          onClick={() => {
            setForm(EMPTY_FORM);
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-orange-500 hover:bg-orange-600"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Address
        </Button>
      </div>

      {/* Address Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-lg my-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-foreground">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="label">Label</Label>
                    <Input
                      id="label"
                      name="label"
                      value={form.label}
                      onChange={handleChange}
                      placeholder="e.g. Home, Office"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="08123456789"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    value={form.recipientName}
                    onChange={handleChange}
                    placeholder="Full name of recipient"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder="Jl. Sudirman No. 123"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Jakarta"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      name="province"
                      value={form.province}
                      onChange={handleChange}
                      placeholder="DKI Jakarta"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="10110"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleChange}
                    className="rounded border-input"
                  />
                  <span className="text-sm text-foreground">
                    Set as default address
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm(EMPTY_FORM);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    {isSaving ? "Saving..." : "Save Address"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">
              No addresses saved yet.
            </p>
            <Button
              size="sm"
              className="mt-4 bg-orange-500 hover:bg-orange-600"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`border-2 transition-colors ${
                address.isDefault
                  ? "border-orange-500"
                  : "border-border"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-foreground">
                        {address.label}
                      </span>
                      {address.isDefault && (
                        <Badge className="bg-orange-500 text-white text-xs border-none">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {address.recipientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.phone}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {address.street}, {address.city},{" "}
                      {address.province} {address.postalCode}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    {!address.isDefault && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetDefault(address.id)}
                        className="text-xs h-7"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(address)}
                      className="text-xs h-7"
                    >
                      Edit
                    </Button>
                    {!address.isDefault && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(address.id)}
                        className="text-xs h-7 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressPage;