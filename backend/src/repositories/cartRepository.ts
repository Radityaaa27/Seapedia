import { prisma } from "../lib/prisma";

export const cartRepository = {
  // Get or create cart for user
  getOrCreate: async (userId: string) => {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                store: { select: { id: true, name: true, slug: true } },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  store: { select: { id: true, name: true, slug: true } },
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }

    return cart;
  },

  addItem: async (userId: string, productId: string, quantity: number) => {
    const cart = await cartRepository.getOrCreate(userId);

    // Check if item already in cart
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existing) {
      // Increment quantity
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
              store: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      });
    }

    // Add new item
    return prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            store: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  },

  updateItem: async (cartItemId: string, quantity: number) => {
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  },

  removeItem: async (cartItemId: string) => {
    return prisma.cartItem.delete({ where: { id: cartItemId } });
  },

  clearCart: async (userId: string) => {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  },
};