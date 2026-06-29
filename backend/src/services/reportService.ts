import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

export const reportService = {
  getSellerReport: async (userId: string) => {
    const store = await prisma.store.findUnique({ where: { userId } });
    if (!store) throw ApiError.notFound("Store not found.");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // All time stats
    const [totalOrders, completedOrders, cancelledOrders] = await Promise.all([
      prisma.order.count({ where: { storeId: store.id } }),
      prisma.order.count({
        where: { storeId: store.id, status: "COMPLETED" },
      }),
      prisma.order.count({
        where: { storeId: store.id, status: "CANCELLED" },
      }),
    ]);

    // Revenue — sum of completed orders
    const revenueResult = await prisma.order.aggregate({
      where: { storeId: store.id, status: "COMPLETED" },
      _sum: { totalAmount: true },
    });
    const totalRevenue = Number(revenueResult._sum.totalAmount ?? 0);

    // This month's revenue
    const thisMonthRevenue = await prisma.order.aggregate({
      where: {
        storeId: store.id,
        status: "COMPLETED",
        createdAt: { gte: startOfMonth },
      },
      _sum: { totalAmount: true },
    });

    // Last month's revenue
    const lastMonthRevenue = await prisma.order.aggregate({
      where: {
        storeId: store.id,
        status: "COMPLETED",
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { totalAmount: true },
    });

    // Top 5 products by quantity sold
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      where: {
        order: {
          storeId: store.id,
          status: { in: ["COMPLETED", "DELIVERED", "ON_DELIVERY"] },
        },
      },
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    // Recent 10 orders
    const recentOrders = await prisma.order.findMany({
      where: { storeId: store.id },
      include: {
        buyer: { select: { name: true } },
        items: { take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Monthly revenue for chart (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const result = await prisma.order.aggregate({
        where: {
          storeId: store.id,
          status: "COMPLETED",
          createdAt: { gte: start, lte: end },
        },
        _sum: { totalAmount: true },
      });
      monthlyRevenue.push({
        month: start.toLocaleString("id-ID", { month: "short", year: "numeric" }),
        revenue: Number(result._sum.totalAmount ?? 0),
      });
    }

    return {
      store: { id: store.id, name: store.name },
      summary: {
        totalRevenue,
        thisMonthRevenue: Number(thisMonthRevenue._sum.totalAmount ?? 0),
        lastMonthRevenue: Number(lastMonthRevenue._sum.totalAmount ?? 0),
        totalOrders,
        completedOrders,
        cancelledOrders,
        totalProducts: await prisma.product.count({
          where: { storeId: store.id, isActive: true },
        }),
      },
      topProducts,
      recentOrders,
      monthlyRevenue,
    };
  },
};