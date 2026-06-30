import { prisma } from "../lib/prisma";
import { OrderStatus } from "../generated/prisma";

export const orderRepository = {
  findByBuyer: async (buyerId: string, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { buyerId },
        include: {
          store: { select: { id: true, name: true, slug: true, logoUrl: true } },
          items: {
            include: {
              product: {
                include: { images: { where: { isPrimary: true }, take: 1 } },
              },
            },
          },
          delivery: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { buyerId } }),
    ]);
    return { orders, total, page, limit };
  },

  findBySeller: async (sellerId: string, page = 1, limit = 10) => {
    const store = await prisma.store.findUnique({
      where: { userId: sellerId },
    });
    if (!store) return { orders: [], total: 0, page, limit };

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { storeId: store.id },
        include: {
          buyer: { select: { id: true, name: true, email: true, phone: true } },
          items: {
            include: {
              product: {
                include: { images: { where: { isPrimary: true }, take: 1 } },
              },
            },
          },
          address: true,
          delivery: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { storeId: store.id } }),
    ]);
    return { orders, total, page, limit };
  },

  findById: async (id: string) => {
    return prisma.order.findUnique({
      where: { id },
      include: {
        buyer: { select: { id: true, name: true, email: true, phone: true } },
        store: { select: { id: true, name: true, slug: true, logoUrl: true } },
        address: true,
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
        delivery: true,
        voucher: true,
      },
    });
  },

  create: async (data: {
    buyerId: string;
    storeId: string;
    addressId: string;
    items: {
      productId: string;
      productName: string;
      productImg?: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[];
    subtotal: number;
    deliveryFee: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    voucherId?: string;
    notes?: string;
  }) => {
    return prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          buyerId: data.buyerId,
          storeId: data.storeId,
          addressId: data.addressId,
          subtotal: data.subtotal,
          deliveryFee: data.deliveryFee,
          taxAmount: data.taxAmount,
          discountAmount: data.discountAmount,
          totalAmount: data.totalAmount,
          voucherId: data.voucherId,
          notes: data.notes,
          status: "PAID",
        },
      });

      // 2. Create order items (snapshot of products)
      await tx.orderItem.createMany({
        data: data.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          productImg: item.productImg,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      });

      // 3. Reduce stock for each product
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 4. Create delivery record
      await tx.delivery.create({
        data: {
          orderId: order.id,
          fee: data.deliveryFee,
          status: "WAITING_FOR_DRIVER",
        },
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: true,
          delivery: true,
          store: { select: { id: true, name: true } },
          address: true,
        },
      });
    });
  },

  updateStatus: async (id: string, status: OrderStatus) => {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  },
};