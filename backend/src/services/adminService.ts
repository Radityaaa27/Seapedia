import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { walletRepository } from "../repositories/walletRepository";
import { orderRepository } from "../repositories/orderRepository";
import { WalletTransactionType, OrderStatus } from "../generated/prisma";
import { OVERDUE_DAYS_BY_METHOD, SHIPPED_GRACE_DAYS } from "../validators/orderValidator";

// Orders that haven't been picked up by a driver yet.
// If overdue at this stage, the buyer never received anything -> REFUND.
const PRE_SHIPMENT_STATUSES: OrderStatus[] = ["PAID", "PROCESSING", "READY_FOR_PICKUP"];

// Orders that have already left the seller / reached the buyer.
// If overdue at this stage (buyer never confirmed), goods are treated
// as returned -> RETURNED (refund + stock restored).
const POST_SHIPMENT_STATUSES: OrderStatus[] = ["ON_DELIVERY", "DELIVERED"];

const daysBetween = (from: Date, to: Date) =>
  (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);

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

  // Lists orders that are currently overdue (or close to it), split into
  // two buckets so the admin can see which ones will be auto-refunded
  // vs. auto-returned once the overdue job runs.
  getOverdueOrders: async () => {
    const now = new Date();

    const candidates = await prisma.order.findMany({
      where: { status: { in: [...PRE_SHIPMENT_STATUSES, ...POST_SHIPMENT_STATUSES] } },
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        store: { select: { name: true } },
        items: { take: 2 },
      },
      orderBy: { createdAt: "asc" },
    });

    const pendingShipmentOverdue = [];
    const inTransitOverdue = [];

    for (const order of candidates) {
      const ageDays = daysBetween(order.createdAt, now);
      const threshold = OVERDUE_DAYS_BY_METHOD[order.deliveryMethod];

      if (PRE_SHIPMENT_STATUSES.includes(order.status) && ageDays > threshold) {
        pendingShipmentOverdue.push({ ...order, ageDays, thresholdDays: threshold, willBe: "REFUNDED" as const });
      } else if (
        POST_SHIPMENT_STATUSES.includes(order.status) &&
        ageDays > threshold + SHIPPED_GRACE_DAYS
      ) {
        inTransitOverdue.push({
          ...order,
          ageDays,
          thresholdDays: threshold + SHIPPED_GRACE_DAYS,
          willBe: "RETURNED" as const,
        });
      }
    }

    return { pendingShipmentOverdue, inTransitOverdue };
  },

  // Runs the overdue job once. This is the "simulate next day" mechanism:
  // triggered manually by an admin (via API) or via a standalone script
  // (see src/scripts/simulateNextDay.ts). It evaluates every active order
  // against its delivery-method deadline and, if overdue, automatically
  // refunds (not yet shipped) or returns (already shipped/delivered but
  // never confirmed) the order.
  runOverdueCheck: async () => {
    const now = new Date();

    const candidates = await prisma.order.findMany({
      where: { status: { in: [...PRE_SHIPMENT_STATUSES, ...POST_SHIPMENT_STATUSES] } },
      include: { items: true },
    });

    const refundedOrderIds: string[] = [];
    const returnedOrderIds: string[] = [];

    for (const order of candidates) {
      const ageDays = daysBetween(order.createdAt, now);
      const threshold = OVERDUE_DAYS_BY_METHOD[order.deliveryMethod];

      const isPreShipOverdue =
        PRE_SHIPMENT_STATUSES.includes(order.status) && ageDays > threshold;
      const isPostShipOverdue =
        POST_SHIPMENT_STATUSES.includes(order.status) &&
        ageDays > threshold + SHIPPED_GRACE_DAYS;

      if (!isPreShipOverdue && !isPostShipOverdue) continue;

      const finalStatus: OrderStatus = isPostShipOverdue ? "RETURNED" : "REFUNDED";

      // 1. Refund the buyer's wallet
      const wallet = await walletRepository.findByUserId(order.buyerId);
      if (wallet) {
        await walletRepository.credit(
          wallet.id,
          Number(order.totalAmount),
          Number(wallet.balance),
          WalletTransactionType.REFUND,
          finalStatus === "RETURNED"
            ? `Auto-return refund for overdue order #${order.id.slice(0, 8).toUpperCase()}`
            : `Auto-refund for overdue order #${order.id.slice(0, 8).toUpperCase()}`,
          order.id
        );
      }

      // 2. Restore stock, update order status, log history, notify buyer
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: { status: finalStatus },
        });

        await orderRepository.appendStatusHistory(
          tx,
          order.id,
          finalStatus,
          finalStatus === "RETURNED"
            ? `Automatically returned: exceeded ${(threshold + SHIPPED_GRACE_DAYS).toFixed(0)} day(s) without buyer confirmation.`
            : `Automatically refunded: exceeded ${threshold} day(s) without being shipped.`
        );

        await tx.notification.create({
          data: {
            userId: order.buyerId,
            title:
              finalStatus === "RETURNED"
                ? "Order Returned & Refunded"
                : "Order Refunded (Overdue)",
            message: `Your order #${order.id.slice(0, 8).toUpperCase()} was automatically ${
              finalStatus === "RETURNED" ? "returned and refunded" : "refunded"
            } because it exceeded the allowed time for its delivery method (${order.deliveryMethod}).`,
            link: `/orders/${order.id}`,
          },
        });
      });

      if (finalStatus === "RETURNED") returnedOrderIds.push(order.id);
      else refundedOrderIds.push(order.id);
    }

    return {
      checkedAt: now,
      totalChecked: candidates.length,
      refundedCount: refundedOrderIds.length,
      returnedCount: returnedOrderIds.length,
      refundedOrderIds,
      returnedOrderIds,
    };
  },

  // Manual single-order admin override (kept for ad-hoc intervention,
  // separate from the automatic overdue job above).
  forceCancelOrder: async (orderId: string) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw ApiError.notFound("Order not found.");

    if (["COMPLETED", "CANCELLED", "REFUNDED", "RETURNED"].includes(order.status)) {
      throw ApiError.badRequest("Order is already in a final state.");
    }

    const finalStatus: OrderStatus = POST_SHIPMENT_STATUSES.includes(order.status)
      ? "RETURNED"
      : "REFUNDED";

    // Refund buyer wallet
    const wallet = await walletRepository.findByUserId(order.buyerId);
    if (wallet) {
      await walletRepository.credit(
        wallet.id,
        Number(order.totalAmount),
        Number(wallet.balance),
        WalletTransactionType.REFUND,
        `Admin ${finalStatus === "RETURNED" ? "return-refund" : "refund"} for order #${order.id.slice(0, 8).toUpperCase()}`,
        order.id
      );
    }

    return prisma.$transaction(async (tx) => {
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
        data: { status: finalStatus },
      });

      await orderRepository.appendStatusHistory(
        tx,
        orderId,
        finalStatus,
        "Force-refunded by admin (manual intervention)."
      );

      // Notify buyer
      await tx.notification.create({
        data: {
          userId: order.buyerId,
          title: finalStatus === "RETURNED" ? "Order Returned" : "Order Refunded",
          message: `Your order #${order.id.slice(0, 8).toUpperCase()} has been ${
            finalStatus === "RETURNED" ? "returned and refunded" : "refunded"
          } by admin.`,
          link: `/orders/${order.id}`,
        },
      });

      return updated;
    });
  },
};