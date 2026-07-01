import { prisma } from "../lib/prisma";
import { OrderStatus, DeliveryMethod, Prisma } from "../generated/prisma";

const statusHistoryInclude = {
  orderBy: { createdAt: "asc" as const },
};

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
          statusHistory: statusHistoryInclude,
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
          statusHistory: statusHistoryInclude,
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
        statusHistory: statusHistoryInclude,
      },
    });
  },

  create: async (data: {
    buyerId: string;
    storeId: string;
    addressId: string;
    deliveryMethod: DeliveryMethod;
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
          deliveryMethod: data.deliveryMethod,
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

      // 3. Reduce stock for each product (never below zero)
      for (const item of data.items) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw new Error(`Insufficient stock while creating order for product ${item.productId}`);
        }
      }

      // 4. Create delivery record
      await tx.delivery.create({
        data: {
          orderId: order.id,
          fee: data.deliveryFee,
          status: "WAITING_FOR_DRIVER",
        },
      });

      // 5. Record initial status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "PAID",
          note: "Order placed and paid from wallet.",
        },
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: true,
          delivery: true,
          store: { select: { id: true, name: true } },
          address: true,
          statusHistory: statusHistoryInclude,
        },
      });
    });
  },

  updateStatus: async (id: string, status: OrderStatus, note?: string) => {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: { status },
      });
      await tx.orderStatusHistory.create({
        data: { orderId: id, status, note },
      });
      return order;
    });
  },

  // Helper for other services that already hold a transaction client
  // (e.g. driverService, adminService) so status changes made inside
  // their own transactions are still logged to history.
  appendStatusHistory: async (
    tx: Prisma.TransactionClient,
    orderId: string,
    status: OrderStatus,
    note?: string
  ) => {
    return tx.orderStatusHistory.create({
      data: { orderId, status, note },
    });
  },
};