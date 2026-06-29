import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { addressService } from "../../services/addressService";
import { orderService } from "../../services/orderService";
import { Address } from "../../types/addressTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MapPin,
  ShoppingBag,
  Wallet,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react";
import { walletService } from "../../services/walletService";
import { Wallet as WalletType } from "../../types/walletTypes";

const PPN_RATE = 0.11;
const formatRupiah = (n: number) => `Rp ${Number(n).toLocaleString("id-ID")}`;

const calculateDeliveryFee = (totalWeightGrams: number) => {
  const base = Math.ceil(totalWeightGrams / 100) * 1000;
  return Math.max(base, 5000);
};

// Group cart items by store
const groupByStore = (items: any[]) => {
  return items.reduce((acc, item) => {
    const storeId = item.product.store.id;
    if (!acc[storeId]) {
      acc[storeId] = { store: item.product.store, items: [] };
    }
    acc[storeId].items.push(item);
    return acc;
  }, {} as Record<string, { store: any; items: any[] }>);
};

const CheckoutPage = () => {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const [addr, wal] = await Promise.all([
          addressService.getAddresses(),
          walletService.getWallet(),
        ]);
        setAddresses(addr);
        setWallet(wal);
        const defaultAddr = addr.find((a) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
      } catch {
        toast.error("Failed to load checkout data.");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const storeGroups = groupByStore(cart?.items ?? []);
  const storeGroupList = Object.values(storeGroups);

  // Get selected store group
  const activeGroup = selectedStoreId
    ? storeGroups[selectedStoreId]
    : storeGroupList[0];

  useEffect(() => {
    if (storeGroupList.length > 0 && !selectedStoreId) {
      setSelectedStoreId(storeGroupList[0].store.id);
    }
  }, [cart]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/20" />
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button onClick={() => navigate("/products")} className="bg-orange-500 hover:bg-orange-600">
          Browse Products
        </Button>
      </div>
    );
  }

  // Calculate for selected store
  const activeItems = activeGroup?.items ?? [];
  const subtotal = activeItems.reduce(
    (sum: number, item: any) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const totalWeight = activeItems.reduce(
    (sum: number, item: any) => sum + Number(item.product.weight) * item.quantity,
    0
  );
  const deliveryFee = calculateDeliveryFee(totalWeight);
  const taxAmount = Math.round(subtotal * PPN_RATE);
  const totalAmount = subtotal + deliveryFee + taxAmount;
  const walletBalance = Number(wallet?.balance ?? 0);
  const isBalanceSufficient = walletBalance >= totalAmount;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (!activeGroup) {
      toast.error("Please select a store to checkout from.");
      return;
    }
    if (!isBalanceSufficient) {
      toast.error("Insufficient wallet balance. Please top up first.");
      return;
    }

    setIsPlacing(true);
    try {
      const order = await orderService.createOrder({
        addressId: selectedAddress,
        storeId: activeGroup.store.id,
        items: activeItems.map((item: any) => ({
          cartItemId: item.id,
          productId: item.product.id,
          quantity: item.quantity,
        })),
        notes: notes || undefined,
      });

      await refreshCart();
      toast.success("Order placed successfully! 🎉");
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order.");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">

          {/* Store selector (if multiple stores in cart) */}
          {storeGroupList.length > 1 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Select Store to Checkout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {storeGroupList.map((group: any) => (
                  <button
                    key={group.store.id}
                    onClick={() => setSelectedStoreId(group.store.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left ${
                      selectedStoreId === group.store.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-border hover:border-orange-300"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{group.store.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {group.items.length} items
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Delivery Address */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    No addresses saved.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/addresses")}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Address
                  </Button>
                </div>
              ) : (
                addresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selectedAddress === addr.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-border hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{addr.label}</span>
                      {addr.isDefault && (
                        <Badge className="bg-orange-500 text-white text-xs border-none">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground">{addr.recipientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {addr.street}, {addr.city}, {addr.province} {addr.postalCode}
                    </p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Items from {activeGroup?.store.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeItems.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden shrink-0">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRupiah(Number(item.product.price))} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-orange-500 shrink-0">
                    {formatRupiah(Number(item.product.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Order Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for the seller..."
                rows={2}
                maxLength={200}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
              />
            </CardContent>
          </Card>

        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{formatRupiah(deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (PPN 11%)</span>
                  <span>{formatRupiah(taxAmount)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">{formatRupiah(totalAmount)}</span>
                </div>
              </div>

              {/* Wallet balance */}
              <div
                className={`rounded-lg p-3 text-sm ${
                  isBalanceSufficient ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Wallet Balance</span>
                </div>
                <p
                  className={`font-semibold ${
                    isBalanceSufficient ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatRupiah(walletBalance)}
                </p>
                {!isBalanceSufficient && (
                  <p className="text-xs text-red-500 mt-1">
                    Need {formatRupiah(totalAmount - walletBalance)} more.
                  </p>
                )}
              </div>

              {!isBalanceSufficient && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/wallet")}
                >
                  Top Up Wallet
                </Button>
              )}

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={handlePlaceOrder}
                disabled={
                  isPlacing ||
                  !selectedAddress ||
                  !isBalanceSufficient ||
                  activeItems.length === 0
                }
              >
                {isPlacing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Payment will be deducted from your wallet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;