import { walletRepository } from "../repositories/walletRepository";
import { TopUpInput } from "../validators/walletValidator";
import { ApiError } from "../utils/ApiError";

export const walletService = {
  getWallet: async (userId: string) => {
    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) {
      throw ApiError.notFound(
        "Wallet not found. Please contact support."
      );
    }
    return wallet;
  },

  topUp: async (userId: string, input: TopUpInput) => {
    // 1. Get current wallet
    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) throw ApiError.notFound("Wallet not found.");

    // 2. Perform top up
    const result = await walletRepository.topUp(
      wallet.id,
      input.amount,
      Number(wallet.balance)
    );

    return result;
  },

  getTransactions: async (
    userId: string,
    page: number = 1,
    limit: number = 20
  ) => {
    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) throw ApiError.notFound("Wallet not found.");

    return walletRepository.getTransactions(wallet.id, page, limit);
  },
};