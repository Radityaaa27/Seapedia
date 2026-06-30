import { prisma } from "../lib/prisma";
import { WalletTransactionType } from "../generated/prisma";

export const walletRepository = {
  findByUserId: async (userId: string) => {
    return prisma.wallet.findUnique({
      where: { userId },
    });
  },

  getTransactions: async (
    walletId: string,
    page: number = 1,
    limit: number = 20
  ) => {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where: { walletId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.walletTransaction.count({ where: { walletId } }),
    ]);
    return { transactions, total, page, limit };
  },

  topUp: async (
    walletId: string,
    amount: number,
    currentBalance: number
  ): Promise<{ wallet: any; transaction: any }> => {
    const newBalance = currentBalance + amount;

    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { id: walletId },
        data: { balance: newBalance },
      });

      const transaction = await tx.walletTransaction.create({
        data: {
          walletId,
          type: WalletTransactionType.TOPUP,
          amount,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description: "Wallet top up",
        },
      });

      return { wallet, transaction };
    });
  },

  deduct: async (
    walletId: string,
    amount: number,
    currentBalance: number,
    description: string,
    referenceId?: string
  ): Promise<{ wallet: any; transaction: any }> => {
    const newBalance = currentBalance - amount;

    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { id: walletId },
        data: { balance: newBalance },
      });

      const transaction = await tx.walletTransaction.create({
        data: {
          walletId,
          type: WalletTransactionType.PAYMENT,
          amount,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description,
          referenceId,
        },
      });

      return { wallet, transaction };
    });
  },

  credit: async (
    walletId: string,
    amount: number,
    currentBalance: number,
    type: WalletTransactionType,
    description: string,
    referenceId?: string
  ): Promise<{ wallet: any; transaction: any }> => {
    const newBalance = currentBalance + amount;

    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { id: walletId },
        data: { balance: newBalance },
      });

      const transaction = await tx.walletTransaction.create({
        data: {
          walletId,
          type,
          amount,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description,
          referenceId,
        },
      });

      return { wallet, transaction };
    });
  },
};