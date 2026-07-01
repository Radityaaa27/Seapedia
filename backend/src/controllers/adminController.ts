import { Request, Response } from "express";
import { adminService } from "../services/adminService";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const adminController = {
  getOverview: async (_req: Request, res: Response) => {
    const overview = await adminService.getOverview();
    res.json(ApiResponse.success("Overview retrieved.", overview));
  },

  getUsers: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search as string | undefined;
    const result = await adminService.getUsers(page, limit, search);
    res.json(
      ApiResponse.success("Users retrieved.", result.users, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      })
    );
  },

  toggleUserActive: async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const user = await adminService.toggleUserActive(userId);
    res.json(ApiResponse.success("User status updated.", user));
  },

  assignRole: async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const { role } = req.body;
    if (!role) throw ApiError.badRequest("Role is required.");
    const result = await adminService.assignRole(userId, role);
    res.json(ApiResponse.success("Role assigned.", result));
  },

  getOverdueOrders: async (_req: Request, res: Response) => {
    const orders = await adminService.getOverdueOrders();
    res.json(ApiResponse.success("Overdue orders retrieved.", orders));
  },

  forceCancelOrder: async (req: Request, res: Response) => {
    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const order = await adminService.forceCancelOrder(orderId);
    res.json(ApiResponse.success("Order refunded.", order));
  },

  // Manual trigger for the overdue job. Represents "simulating the next
  // day" so overdue orders (based on their delivery method's deadline)
  // get auto-refunded or auto-returned without waiting for a real cron.
  simulateNextDay: async (_req: Request, res: Response) => {
    const result = await adminService.runOverdueCheck();
    res.json(ApiResponse.success("Overdue check completed.", result));
  },
};