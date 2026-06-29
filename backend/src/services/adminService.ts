import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { walletRepository } from "../repositories/walletRepository";
import { WalletTransactionType } from "../generated/prisma";

export const adminService = {
  // ── Overview ─────────────────────────────────────────────

  getOverview: async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalStores,
      totalProducts,
      totalOrders,
      newUsersThisMonth,
      newOrdersThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.store.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    // Total revenue from completed orders
    const revenueResult = await prisma.order.aggregate({
      where: { status: "COMPLETED" },
      _sum: { totalAmount: true },
    });

    // This month revenue
    const thisMonthRevenue = await prisma.order.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: { gte: startOfMonth },
      },
      _sum: { totalAmount: true },
    });

    // Orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    // Recent 10 orders
    const recentOrders = await prisma.order.findMany({
      include: {
        buyer: { select: { name: true, email: true } },
        store: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Recent 5 users
    const recentUsers = await prisma.user.findMany({
      include: { roles: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return {
      stats: {
        totalUsers,
        totalStores,
        totalProducts,
        totalOrders,
        newUsersThisMonth,
        newOrdersThisMonth,
        totalRevenue: Number(revenueResult._sum.totalAmount ?? 0),
        thisMonthRevenue: Number(thisMonthRevenue._sum.totalAmount ?? 0),
      },
      ordersByStatus,
      recentOrders,
      recentUsers,
    };
  },

  // ── Users ─────────────────────────────────────────────────

  getUsers: async (page = 1, limit = 20, search?: string) => {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          roles: true,
          _count: { select: { ordersAsBuyer: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  },

  toggleUserActive: async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound("User not found.");
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });
  },

  assignRole: async (userId: string, role: string) => {
    const validRoles = ["ADMIN", "BUYER", "SELLER", "DRIVER"];
    if (!validRoles.includes(role)) {
      throw ApiError.badRequest("Invalid role.");
    }

    const existing = await prisma.userRole.findUnique({
      where: { userId_role: { userId, role: role as any } },
    });
    if (existing) throw ApiError.conflict("User already has this role.");

    return prisma.userRole.create({
      data: { userId, role: role as any, isActive: false },
    });
  },

  // ── Overdue Orders ────────────────────────────────────────

  getOverdueOrders: async () => {
    // Orders stuck in PENDING_PAYMENT for more than 1 day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return prisma.order.findMany({
      where: {
        status: { in: ["PENDING_PAYMENT", "PAID", "PROCESSING"] },
        updatedAt: { lt: oneDayAgo },
      },
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        store: { select: { name: true } },
        items: { take: 2 },
      },
      orderBy: { updatedAt: "asc" },
      take: 50,
    });
  },

  forceCancelOrder: async (orderId: string) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw ApiError.notFound("Order not found.");

    if (["COMPLETED", "CANCELLED", "REFUNDED"].includes(order.status)) {
      throw ApiError.badRequest("Order is already in a final state.");
    }

    return prisma.$transaction(async (tx) => {
      // Refund buyer wallet
      const wallet = await walletRepository.findByUserId(order.buyerId);
      if (wallet) {
        await walletRepository.credit(
          wallet.id,
          Number(order.totalAmount),
          Number(wallet.balance),
          WalletTransactionType.REFUND,
          `Admin refund for order #${order.id.slice(0, 8).toUpperCase()}`,
          order.id
        );
      }

      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // Update order
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: "REFUNDED" },
      });

      // Notify buyer
      await tx.notification.create({
        data: {
          userId: order.buyerId,
          title: "Order Refunded",
          message: `Your order #${order.id.slice(0, 8).toUpperCase()} has been refunded by admin.`,
          link: `/orders/${order.id}`,
        },
      });

      return updated;
    });
  },
};