import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { Voucher, Promo } from "../../types/voucherTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Tag,
  Plus,
  ToggleLeft,
  ToggleRight,
  Megaphone,
  X,
  Loader2,
} from "lucide-react";

const formatRupiah = (n: number) =>
  `Rp ${Number(n).toLocaleString("id-ID")}`;

const EMPTY_VOUCHER = {
  code: "",
  type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
  value: "",
  minOrderAmount: "",
  maxDiscount: "",
  usageLimit: "",
  expiresAt: "",
};

const EMPTY_PROMO = {
  title: "",
  description: "",
  type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
  value: "",
  bannerUrl: "",
  startDate: "",
  endDate: "",
};

const AdminVouchersPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"vouchers" | "promos">(
    "vouchers"
  );
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [voucherForm, setVoucherForm] = useState(EMPTY_VOUCHER);
  const [promoForm, setPromoForm] = useState(EMPTY_PROMO);
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [v, p] = await Promise.all([
        adminService.getVouchers(),
        adminService.getPromos(),
      ]);
      setVouchers(v);
      setPromos(p);
    } catch {
      toast.error("Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminService.createVoucher({
        code: voucherForm.code,
        type: voucherForm.type,
        value: Number(voucherForm.value),
        ...(voucherForm.minOrderAmount && {
          minOrderAmount: Number(voucherForm.minOrderAmount),
        }),
        ...(voucherForm.maxDiscount && {
          maxDiscount: Number(voucherForm.maxDiscount),
        }),
        ...(voucherForm.usageLimit && {
          usageLimit: Number(voucherForm.usageLimit),
        }),
        ...(voucherForm.expiresAt && {
          expiresAt: new Date(voucherForm.expiresAt).toISOString(),
        }),
      });
      toast.success("Voucher created!");
      setShowVoucherForm(false);
      setVoucherForm(EMPTY_VOUCHER);
      fetchAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create voucher.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminService.createPromo({
        title: promoForm.title,
        description: promoForm.description || undefined,
        type: promoForm.type,
        value: Number(promoForm.value),
        bannerUrl: promoForm.bannerUrl || undefined,
        startDate: new Date(promoForm.startDate).toISOString(),
        endDate: new Date(promoForm.endDate).toISOString(),
      });
      toast.success("Promo created!");
      setShowPromoForm(false);
      setPromoForm(EMPTY_PROMO);
      fetchAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create promo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVoucher = async (id: string) => {
    setActionLoading(id);
    try {
      await adminService.toggleVoucher(id);
      fetchAll();
    } catch {
      toast.error("Failed to toggle voucher.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePromo = async (id: string) => {
    setActionLoading(id);
    try {
      await adminService.togglePromo(id);
      fetchAll();
    } catch {
      toast.error("Failed to toggle promo.");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Memuat voucher & promo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-black text-foreground tracking-tight">
          Vouchers & Promos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola kode diskon dan program promosi Seapedia.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted/50 p-1 rounded-2xl mb-6 gap-1 w-fit">
        {[
          { key: "vouchers", label: "🏷️ Vouchers", count: vouchers.length },
          { key: "promos", label: "📣 Promos", count: promos.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setActiveTab(tab.key as "vouchers" | "promos")
            }
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              activeTab === tab.key ? "bg-purple-100 text-purple-700" : "bg-muted text-muted-foreground"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* VOUCHERS TAB */}
      {activeTab === "vouchers" && (
        <div>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {vouchers.length} vouchers total
            </p>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setShowVoucherForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Create Voucher
            </Button>
          </div>

          {/* Voucher form modal */}
          {showVoucherForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold">Create Voucher</h2>
                  <button
                    onClick={() => setShowVoucherForm(false)}
                    className="text-muted-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <form onSubmit={handleCreateVoucher} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Code</Label>
                        <Input
                          value={voucherForm.code}
                          onChange={(e) =>
                            setVoucherForm((p) => ({
                              ...p,
                              code: e.target.value.toUpperCase(),
                            }))
                          }
                          placeholder="SAVE10"
                          required
                          className="uppercase"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Type</Label>
                        <select
                          value={voucherForm.type}
                          onChange={(e) =>
                            setVoucherForm((p) => ({
                              ...p,
                              type: e.target.value as any,
                            }))
                          }
                          className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:border-orange-500"
                        >
                          <option value="PERCENTAGE">Percentage (%)</option>
                          <option value="FIXED">Fixed (Rp)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>
                          Value{" "}
                          {voucherForm.type === "PERCENTAGE" ? "(%)" : "(Rp)"}
                        </Label>
                        <Input
                          type="number"
                          value={voucherForm.value}
                          onChange={(e) =>
                            setVoucherForm((p) => ({
                              ...p,
                              value: e.target.value,
                            }))
                          }
                          placeholder={
                            voucherForm.type === "PERCENTAGE" ? "10" : "20000"
                          }
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Usage Limit</Label>
                        <Input
                          type="number"
                          value={voucherForm.usageLimit}
                          onChange={(e) =>
                            setVoucherForm((p) => ({
                              ...p,
                              usageLimit: e.target.value,
                            }))
                          }
                          placeholder="100 (optional)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Min Order (Rp)</Label>
                        <Input
                          type="number"
                          value={voucherForm.minOrderAmount}
                          onChange={(e) =>
                            setVoucherForm((p) => ({
                              ...p,
                              minOrderAmount: e.target.value,
                            }))
                          }
                          placeholder="50000 (optional)"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Max Discount (Rp)</Label>
                        <Input
                          type="number"
                          value={voucherForm.maxDiscount}
                          onChange={(e) =>
                            setVoucherForm((p) => ({
                              ...p,
                              maxDiscount: e.target.value,
                            }))
                          }
                          placeholder="25000 (optional)"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Expires At (optional)</Label>
                      <Input
                        type="datetime-local"
                        value={voucherForm.expiresAt}
                        onChange={(e) =>
                          setVoucherForm((p) => ({
                            ...p,
                            expiresAt: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowVoucherForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                      >
                        {isSaving ? "Creating..." : "Create"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Voucher list */}
          <div className="space-y-3">
            {vouchers.map((voucher) => (
              <Card key={voucher.id}>
                <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                      <Tag className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-bold text-foreground">
                          {voucher.code}
                        </p>
                        <Badge
                          className={`text-xs border-none ${
                            voucher.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {voucher.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-orange-500">
                        {voucher.type === "PERCENTAGE"
                          ? `${voucher.value}% off`
                          : `${formatRupiah(voucher.value)} off`}
                        {voucher.maxDiscount &&
                          ` (max ${formatRupiah(
                            Number(voucher.maxDiscount)
                          )})`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Used: {voucher.usedCount}
                        {voucher.usageLimit
                          ? `/${voucher.usageLimit}`
                          : ""}{" "}
                        ·
                        {voucher.expiresAt
                          ? ` Expires ${new Date(
                              voucher.expiresAt
                            ).toLocaleDateString("id-ID")}`
                          : " No expiry"}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleVoucher(voucher.id)}
                    disabled={actionLoading === voucher.id}
                    className={
                      voucher.isActive ? "text-red-500" : "text-green-500"
                    }
                  >
                    {actionLoading === voucher.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : voucher.isActive ? (
                      <>
                        <ToggleLeft className="w-4 h-4 mr-1" /> Deactivate
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-4 h-4 mr-1" /> Activate
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* PROMOS TAB */}
      {activeTab === "promos" && (
        <div>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {promos.length} promos total
            </p>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setShowPromoForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Create Promo
            </Button>
          </div>

          {/* Promo form modal */}
          {showPromoForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold">Create Promo</h2>
                  <button
                    onClick={() => setShowPromoForm(false)}
                    className="text-muted-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <form onSubmit={handleCreatePromo} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Title</Label>
                      <Input
                        value={promoForm.title}
                        onChange={(e) =>
                          setPromoForm((p) => ({
                            ...p,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Harbolnas Sale"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Description (optional)</Label>
                      <Input
                        value={promoForm.description}
                        onChange={(e) =>
                          setPromoForm((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Up to 50% off all items"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Type</Label>
                        <select
                          value={promoForm.type}
                          onChange={(e) =>
                            setPromoForm((p) => ({
                              ...p,
                              type: e.target.value as any,
                            }))
                          }
                          className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:border-orange-500"
                        >
                          <option value="PERCENTAGE">Percentage</option>
                          <option value="FIXED">Fixed</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Value</Label>
                        <Input
                          type="number"
                          value={promoForm.value}
                          onChange={(e) =>
                            setPromoForm((p) => ({
                              ...p,
                              value: e.target.value,
                            }))
                          }
                          placeholder="50"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Start Date</Label>
                        <Input
                          type="datetime-local"
                          value={promoForm.startDate}
                          onChange={(e) =>
                            setPromoForm((p) => ({
                              ...p,
                              startDate: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>End Date</Label>
                        <Input
                          type="datetime-local"
                          value={promoForm.endDate}
                          onChange={(e) =>
                            setPromoForm((p) => ({
                              ...p,
                              endDate: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Banner URL (optional)</Label>
                      <Input
                        value={promoForm.bannerUrl}
                        onChange={(e) =>
                          setPromoForm((p) => ({
                            ...p,
                            bannerUrl: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowPromoForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                      >
                        {isSaving ? "Creating..." : "Create"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Promo list */}
          <div className="space-y-3">
            {promos.map((promo) => (
              <Card key={promo.id}>
                <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {promo.title}
                        </p>
                        <Badge
                          className={`text-xs border-none ${
                            promo.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {promo.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {promo.description && (
                        <p className="text-sm text-muted-foreground">
                          {promo.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {promo.type === "PERCENTAGE"
                          ? `${promo.value}% off`
                          : `${formatRupiah(Number(promo.value))} off`}{" "}
                        ·{" "}
                        {new Date(promo.startDate).toLocaleDateString(
                          "id-ID"
                        )}{" "}
                        →{" "}
                        {new Date(promo.endDate).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTogglePromo(promo.id)}
                    disabled={actionLoading === promo.id}
                    className={
                      promo.isActive ? "text-red-500" : "text-green-500"
                    }
                  >
                    {actionLoading === promo.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : promo.isActive ? (
                      <>
                        <ToggleLeft className="w-4 h-4 mr-1" /> Deactivate
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-4 h-4 mr-1" /> Activate
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVouchersPage;