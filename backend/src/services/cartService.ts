import { cartRepository } from "../repositories/cartRepository";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

export const cartService = {
  getCart: async (userId: string) => {
    return cartRepository.getOrCreate(userId);
  },

  addItem: async (userId: string, productId: string, quantity: number) => {
    // Validate product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || !product.isActive) {
      throw ApiError.notFound("Product not found.");
    }
    if (product.stock < quantity) {
      throw ApiError.badRequest(
        `Only ${product.stock} items available in stock.`
      );
    }
    return cartRepository.addItem(userId, productId, quantity);
  },

  updateItem: async (
    userId: string,
    cartItemId: string,
    quantity: number
  ) => {
    if (quantity < 1) {
      throw ApiError.badRequest("Quantity must be at least 1.");
    }

    // Verify ownership
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw ApiError.notFound("Cart not found.");

    const item = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id },
      include: { product: true },
    });
    if (!item) throw ApiError.notFound("Cart item not found.");

    if (item.product.stock < quantity) {
      throw ApiError.badRequest(
        `Only ${item.product.stock} items available in stock.`
      );
    }

    return cartRepository.updateItem(cartItemId, quantity);
  },

  removeItem: async (userId: string, cartItemId: string) => {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw ApiError.notFound("Cart not found.");

    const item = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id },
    });
    if (!item) throw ApiError.notFound("Cart item not found.");

    return cartRepository.removeItem(cartItemId);
  },

  clearCart: async (userId: string) => {
    return cartRepository.clearCart(userId);
  },
};