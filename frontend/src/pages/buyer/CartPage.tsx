import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Store,
  Loader2,
} from "lucide-react";

const formatRupiah = (amount: number) =>
  `Rp ${Number(amount).toLocaleString("id-ID")}`;

const CartPage = () => {
  const { cart, itemCount, isLoading, updateItem, removeItem, clearCart } =
    useCart();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const items = cart?.items ?? [];

  // Group items by store
  const storeGroups = items.reduce(
    (acc, item) => {
      const storeId = item.product.store.id;
      if (!acc[storeId]) {
        acc[storeId] = {
          store: item.product.store,
          items: [],
        };
      }
      acc[storeId].items.push(item);
      return acc;
    },
    {} as Record
      string,
      { store: { id: string; name: string; slug: string }; items: typeof items }
    >
  );

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const handleUpdate = async (itemId: string, quantity: number) => {
    try {
      await updateItem(itemId, quantity);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update cart.");
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeItem(itemId);
      toast.success("Item removed from cart.");
    } catch {
      toast.error("Failed to remove item.");
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared.");
    } catch {
      toast.error("Failed to clear cart.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          My Cart{" "}
          {itemCount > 0 && (
            <span className="text-muted-foreground font-normal text-base">
              ({itemCount} items)
            </span>
          )}
        </h1>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground font-medium">
            Your cart is empty.
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Browse products and add them to your cart.
          </p>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {Object.values(storeGroups).map((group) => (
              <Card key={group.store.id}>
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <Store className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    {group.store.name}
                  </span>
                </div>
                <CardContent className="p-0">
                  {group.items.map((item) => {
                    const image = item.product.images?.[0];
                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 p-4 border-b border-border last:border-0"
                      >
                        {/* Product image */}
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                          {image ? (
                            <img
                              src={image.url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-muted-foreground/20" />
                            </div>
                          )}
                        </div>

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium text-foreground line-clamp-2 cursor-pointer hover:text-orange-500"
                            onClick={() =>
                              navigate(
                                `/products/${item.product.store.slug}/${item.product.slug}`
                              )
                            }
                          >
                            {item.product.name}
                          </p>
                          <p className="text-orange-500 font-semibold text-sm mt-1">
                            {formatRupiah(Number(item.product.price))}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity control */}
                            <div className="flex items-center border border-input rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  handleUpdate(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="px-2 py-1 hover:bg-muted transition-colors disabled:opacity-40"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium border-x border-input">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdate(item.id, item.quantity + 1)
                                }
                                disabled={
                                  item.quantity >= item.product.stock
                                }
                                className="px-2 py-1 hover:bg-muted transition-colors disabled:opacity-40"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Item total */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-foreground">
                                {formatRupiah(
                                  Number(item.product.price) * item.quantity
                                )}
                              </span>
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="text-muted-foreground hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <h2 className="font-semibold text-foreground mb-4">
                  Order Summary
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({itemCount} items)
                    </span>
                    <span className="font-medium">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Delivery Fee
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (PPN 11%)</span>
                    <span className="font-medium text-muted-foreground text-xs">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="border-t border-border my-3" />

                <div className="flex justify-between font-bold text-base mb-4">
                  <span>Estimated Total</span>
                  <span className="text-orange-500">
                    {formatRupiah(subtotal)}
                  </span>
                </div>

                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout{" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;