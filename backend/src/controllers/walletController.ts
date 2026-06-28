import { Request, Response } from "express";
import { walletService } from "../services/walletService";
import { topUpSchema } from "../validators/walletValidator";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const walletController = {
  getWallet: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const wallet = await walletService.getWallet(userId);
    res.json(ApiResponse.success("Wallet retrieved.", wallet));
  },

  topUp: async (req: Request, res: Response) => {
    const parsed = topUpSchema.safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.issues[0].message);
    }
    const userId = (req as any).user.userId;
    const result = await walletService.topUp(userId, parsed.data);
    res.json(
      ApiResponse.success(
        `Successfully topped up Rp ${parsed.data.amount.toLocaleString("id-ID")}.`,
        result
      )
    );
  },

  getTransactions: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await walletService.getTransactions(userId, page, limit);
    res.json(
      ApiResponse.success("Transactions retrieved.", result.transactions, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      })
    );
  },
};