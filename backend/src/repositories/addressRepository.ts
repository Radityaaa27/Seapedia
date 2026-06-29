import { prisma } from "../lib/prisma";
import { AddressInput } from "../validators/addressValidator";

export const addressRepository = {
  findAllByUser: async (userId: string) => {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  },

  findById: async (id: string, userId: string) => {
    return prisma.address.findFirst({
      where: { id, userId },
    });
  },

  create: async (userId: string, input: AddressInput) => {
    return prisma.$transaction(async (tx) => {
      // If new address is default, unset all others first
      if (input.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }
      return tx.address.create({
        data: { userId, ...input },
      });
    });
  },

  update: async (id: string, userId: string, input: Partial<AddressInput>) => {
    return prisma.$transaction(async (tx) => {
      if (input.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }
      return tx.address.update({
        where: { id },
        data: input,
      });
    });
  },

  delete: async (id: string) => {
    return prisma.address.delete({ where: { id } });
  },

  setDefault: async (id: string, userId: string) => {
    return prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
      return tx.address.update({
        where: { id },
        data: { isDefault: true },
      });
    });
  },
};