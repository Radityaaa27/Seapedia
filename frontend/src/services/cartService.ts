import api from "./api";
import { Cart, CartItem } from "../types/cartTypes";

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const res = await api.get<{ data: Cart }>("/cart");
    return res.data.data;
  },

  addItem: async (productId: string, quantity: number = 1): Promise<CartItem> => {
    const res = await api.post<{ data: CartItem }>("/cart/items", {
      productId,
      quantity,
    });
    return res.data.data;
  },

  updateItem: async (itemId: string, quantity: number): Promise<CartItem> => {
    const res = await api.put<{ data: CartItem }>(`/cart/items/${itemId}`, {
      quantity,
    });
    return res.data.data;
  },

  removeItem: async (itemId: string): Promise<void> => {
    await api.delete(`/cart/items/${itemId}`);
  },

  clearCart: async (): Promise<void> => {
    await api.delete("/cart");
  },
};