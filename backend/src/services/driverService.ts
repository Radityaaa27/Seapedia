import { driverRepository } from "../repositories/driverRepository";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { walletRepository } from "../repositories/walletRepository";
import { WalletTransactionType } from "../generated/prisma";

export const driverService = {
  getAvailableJobs: async (page = 1, limit = 10) => {
    return driverRepository.findAvailableJobs(page, limit);
  },

  getJobDetail: async (deliveryId: string) => {
    const job = await driverRepository.findJobById(deliveryId);
    if (!job) throw ApiError.notFound("Delivery job not found.");
    return job;
  },

  getActiveJob: async (driverId: string) => {
    return driverRepository.findActiveJobByDriver(driverId);
  },

  getMyJobs: async (driverId: string, page = 1, limit = 10) => {
    return driverRepository.findJobsByDriver(driverId, page, limit);
  },

  getEarnings: async (driverId: string) => {
    return driverRepository.getDriverEarnings(driverId);
  },

  takeJob: async (driverId: string, deliveryId: string) => {
    // Check job exists and is available
    const job = await driverRepository.findJobById(deliveryId);
    if (!job) throw ApiError.notFound("Delivery job not found.");

    if (job.status !== "WAITING_FOR_DRIVER" || job.driverId !== null) {
      throw ApiError.badRequest("This job has already been taken.");
    }

    if (job.order.status !== "READY_FOR_PICKUP") {
      throw ApiError.badRequest("Order is not ready for pickup yet.");
    }

    // Check driver doesn't already have an active job
    const activeJob = await driverRepository.findActiveJobByDriver(driverId);
    if (activeJob) {
      throw ApiError.badRequest(
        "You already have an active delivery. Complete it first."
      );
    }

    // Assign driver and update order status in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.delivery.update({
        where: { id: deliveryId },
        data: { driverId, status: "ASSIGNED" },
      });
      await tx.order.update({
        where: { id: job.orderId },
        data: { status: "ON_DELIVERY" },
      });
    });

    return driverRepository.findJobById(deliveryId);
  },

  completeJob: async (driverId: string, deliveryId: string) => {
    const job = await driverRepository.findJobById(deliveryId);
    if (!job) throw ApiError.notFound("Delivery job not found.");

    if (job.driverId !== driverId) {
      throw ApiError.forbidden("This is not your delivery job.");
    }

    if (job.status !== "ASSIGNED") {
      throw ApiError.badRequest("Job is not in an active state.");
    }

    // Mark delivered, update order, and credit driver wallet
    await prisma.$transaction(async (tx) => {
      await tx.delivery.update({
        where: { id: deliveryId },
        data: { status: "DELIVERED", deliveredAt: new Date() },
      });

      await tx.order.update({
        where: { id: job.orderId },
        data: { status: "COMPLETED" },
      });

      // Credit driver earnings to wallet
      const wallet = await tx.wallet.findUnique({ where: { userId: driverId } });
      if (wallet) {
        const fee = Number(job.fee);
        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: WalletTransactionType.EARNING,
            amount: fee,
            balanceBefore: Number(wallet.balance),
            balanceAfter: Number(wallet.balance) + fee,
            description: `Delivery earning for order #${job.orderId.slice(0, 8).toUpperCase()}`,
            referenceId: job.orderId,
          },
        });
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: fee } },
        });
      }

      // Notify buyer
      await tx.notification.create({
        data: {
          userId: job.order.buyer.id,
          title: "Order Delivered!",
          message: `Your order #${job.orderId.slice(0, 8).toUpperCase()} has been delivered. Thank you for shopping at SEAPEDIA!`,
          link: `/orders/${job.orderId}`,
        },
      });
    });

    return driverRepository.findJobById(deliveryId);
  },
};