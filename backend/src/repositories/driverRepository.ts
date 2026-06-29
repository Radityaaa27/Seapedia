import { prisma } from "../lib/prisma";

export const driverRepository = {
  findAvailableJobs: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      prisma.delivery.findMany({
        where: {
          status: "WAITING_FOR_DRIVER",
          driverId: null,
          order: { status: "READY_FOR_PICKUP" },
        },
        include: {
          order: {
            include: {
              store: { select: { id: true, name: true, slug: true } },
              address: true,
              items: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      prisma.delivery.count({
        where: {
          status: "WAITING_FOR_DRIVER",
          driverId: null,
          order: { status: "READY_FOR_PICKUP" },
        },
      }),
    ]);
    return { jobs, total, page, limit };
  },

  findJobById: async (deliveryId: string) => {
    return prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        order: {
          include: {
            buyer: { select: { id: true, name: true, phone: true } },
            store: { select: { id: true, name: true, slug: true } },
            address: true,
            items: true,
          },
        },
        driver: { select: { id: true, name: true, phone: true } },
      },
    });
  },

  findActiveJobByDriver: async (driverId: string) => {
    return prisma.delivery.findFirst({
      where: { driverId, status: "ASSIGNED" },
      include: {
        order: {
          include: {
            buyer: { select: { id: true, name: true, phone: true } },
            store: { select: { id: true, name: true, slug: true } },
            address: true,
            items: true,
          },
        },
      },
    });
  },

  findJobsByDriver: async (driverId: string, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      prisma.delivery.findMany({
        where: { driverId },
        include: {
          order: {
            include: {
              store: { select: { id: true, name: true } },
              address: true,
              items: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.delivery.count({ where: { driverId } }),
    ]);
    return { jobs, total, page, limit };
  },

  getDriverEarnings: async (driverId: string) => {
    const result = await prisma.delivery.aggregate({
      where: { driverId, status: "DELIVERED" },
      _sum: { fee: true },
      _count: { id: true },
    });
    return {
      totalEarnings: Number(result._sum.fee ?? 0),
      completedJobs: result._count.id,
    };
  },

  assignDriver: async (deliveryId: string, driverId: string) => {
    return prisma.delivery.update({
      where: { id: deliveryId },
      data: { driverId, status: "ASSIGNED", updatedAt: new Date() },
    });
  },

  markDelivered: async (deliveryId: string) => {
    return prisma.delivery.update({
      where: { id: deliveryId },
      data: { status: "DELIVERED", deliveredAt: new Date(), updatedAt: new Date() },
    });
  },
};