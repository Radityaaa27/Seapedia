import { prisma } from "../lib/prisma";
import { walletRepository } from "../repositories/walletRepository";
import { ApiError } from "../utils/ApiError";
import { WalletTransactionType } from "../generated/prisma";

export const driverService = {
  // Get all deliveries waiting for a driver
  getAvailableJobs: async () => {
    return prisma.delivery.findMany({
      where: {
        status: "WAITING_FOR_DRIVER",
        driverId: null,
        order: { status: "READY_FOR_PICKUP" },
      },
      include: {
        order: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            address: true,
            items: { take: 3 },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  // Get jobs accepted/completed by this driver
  getMyJobs: async (driverId: string) => {
    return prisma.delivery.findMany({
      where: { driverId },
      include: {
        order: {
          include: {
            store: { select: { id: true, name: true } },
            address: true,
            items: { take: 2 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Driver accepts a delivery job
  acceptJob: async (driverId: string, deliveryId: string) => {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: { order: true },
    });

    if (!delivery) throw ApiError.notFound("Delivery not found.");
    if (delivery.driverId) {
      throw ApiError.conflict("This job has already been taken.");
    }
    if (delivery.status !== "WAITING_FOR_DRIVER") {
      throw ApiError.badRequest("This job is no longer available.");
    }
    if (delivery.order.status !== "READY_FOR_PICKUP") {
      throw ApiError.badRequest("Order is not ready for pickup yet.");
    }

    // Check driver doesn't already have an active job
    const activeJob = await prisma.delivery.findFirst({
      where: {
        driverId,
        status: { in: ["ASSIGNED", "PICKED_UP"] },
      },
    });
    if (activeJob) {
      throw ApiError.badRequest(
        "You already have an active delivery. Complete it first."
      );
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.delivery.update({
        where: { id: deliveryId },
        data: {
          driverId,
          status: "ASSIGNED",
        },
        include: {
          order: {
            include: {
              store: { select: { id: true, name: true } },
              address: true,
            },
          },
        },
      });

      // Update order status
      await tx.order.update({
        where: { id: delivery.orderId },
        data: { status: "ON_DELIVERY" },
      });

      // Notify buyer
      await tx.notification.create({
        data: {
          userId: delivery.order.buyerId,
          title: "Your order is on the way!",
          message: "A driver has picked up your order and is heading to you.",
          link: `/orders/${delivery.orderId}`,
        },
      });

      return updated;
    });
  },

  // Driver confirms pickup from seller
  pickUpOrder: async (driverId: string, deliveryId: string) => {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
    });

    if (!delivery) throw ApiError.notFound("Delivery not found.");
    if (delivery.driverId !== driverId) {
      throw ApiError.forbidden("This is not your delivery.");
    }
    if (delivery.status !== "ASSIGNED") {
      throw ApiError.badRequest("Delivery must be ASSIGNED before pickup.");
    }

    return prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        status: "PICKED_UP",
        pickedUpAt: new Date(),
      },
    });
  },

  // Driver marks delivery as completed
  completeDelivery: async (driverId: string, deliveryId: string) => {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: { order: true },
    });

    if (!delivery) throw ApiError.notFound("Delivery not found.");
    if (delivery.driverId !== driverId) {
      throw ApiError.forbidden("This is not your delivery.");
    }
    if (delivery.status !== "PICKED_UP") {
      throw ApiError.badRequest(
        "You must confirm pickup before completing delivery."
      );
    }

    return prisma.$transaction(async (tx) => {
      // 1. Update delivery
      const updated = await tx.delivery.update({
        where: { id: deliveryId },
        data: {
          status: "DELIVERED",
          deliveredAt: new Date(),
        },
      });

      // 2. Update order status
      await tx.order.update({
        where: { id: delivery.orderId },
        data: { status: "DELIVERED" },
      });

      // 3. Credit driver wallet with delivery fee
      const wallet = await walletRepository.findByUserId(driverId);
      if (wallet) {
        await walletRepository.credit(
          wallet.id,
          Number(delivery.fee),
          Number(wallet.balance),
          WalletTransactionType.EARNING,
          `Delivery earning for order #${delivery.orderId.slice(0, 8).toUpperCase()}`,
          delivery.orderId
        );
      }

      // 4. Notify buyer
      await tx.notification.create({
        data: {
          userId: delivery.order.buyerId,
          title: "Order Delivered!",
          message:
            "Your order has been delivered. Please confirm receipt.",
          link: `/orders/${delivery.orderId}`,
        },
      });

      return updated;
    });
  },

  // Get driver earnings summary
  getEarnings: async (driverId: string) => {
    const wallet = await walletRepository.findByUserId(driverId);
    if (!wallet) throw ApiError.notFound("Wallet not found.");

    const earnings = await prisma.walletTransaction.findMany({
      where: {
        walletId: wallet.id,
        type: "EARNING",
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const totalEarnings = earnings.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    const completedDeliveries = await prisma.delivery.count({
      where: { driverId, status: "DELIVERED" },
    });

    return {
      totalEarnings,
      completedDeliveries,
      balance: Number(wallet.balance),
      recentEarnings: earnings,
    };
  },
};