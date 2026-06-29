import { Request, Response } from "express";
import { reportService } from "../services/reportService";
import { ApiResponse } from "../utils/ApiResponse";

export const reportController = {
  getSellerReport: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const report = await reportService.getSellerReport(userId);
    res.json(ApiResponse.success("Report retrieved.", report));
  },
};