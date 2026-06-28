import api from "./api";
import { Wallet, WalletTransaction, TransactionsResponse } from "../types/walletTypes";

export const walletService = {
  getWallet: async (): Promise<Wallet> => {
    const res = await api.get<{ data: Wallet }>("/wallet");
    return res.data.data;
  },

  topUp: async (amount: number) => {
    const res = await api.post<{ data: { wallet: Wallet; transaction: WalletTransaction } }>(
      "/wallet/topup",
      { amount }
    );
    return res.data.data;
  },

  getTransactions: async (page = 1, limit = 20): Promise<TransactionsResponse> => {
    const res = await api.get<TransactionsResponse>("/wallet/transactions", {
      params: { page, limit },
    });
    return res.data;
  },
};