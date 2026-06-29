import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { cartService } from "../services/cartService";
import { Cart } from "../types/cartTypes";
import { useAuth } from "../hooks/useAuth";

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      setCart(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (productId: string, quantity: number = 1) => {
    await cartService.addItem(productId, quantity);
    await refreshCart();
  };

  const updateItem = async (itemId: string, quantity: number) => {
    await cartService.updateItem(itemId, quantity);
    await refreshCart();
  };

  const removeItem = async (itemId: string) => {
    await cartService.removeItem(itemId);
    await refreshCart();
  };

  const clearCart = async () => {
    await cartService.clearCart();
    await refreshCart();
  };

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};