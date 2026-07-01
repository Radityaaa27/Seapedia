import { Request, Response } from "express";
import { orderService } from "../services/orderService";
import { createOrderSchema } from "../validators/orderValidator";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const orderController = {
  createOrder: async (req: Request, res: Response) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.issues[0].message);
    }
    const userId = (req as any).user.userId;
    const order = await orderService.createOrder(userId, parsed.data);
    res.status(201).json(ApiResponse.success("Order placed successfully.", order));
  },

  getMyOrders: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await orderService.getMyOrders(userId, page, limit);
    res.json(
      ApiResponse.success("Orders retrieved.", result.orders, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      })
    );
  },

  getOrderDetail: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const order = await orderService.getOrderDetail(userId, orderId);
    res.json(ApiResponse.success("Order retrieved.", order));
  },

  cancelOrder: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const order = await orderService.cancelOrder(userId, orderId);
    res.json(ApiResponse.success("Order cancelled. Refund processed.", order));
  },

  confirmReceipt: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const order = await orderService.confirmReceipt(userId, orderId);
    res.json(ApiResponse.success("Order marked as completed. Thank you!", order));
  },

  getSellerOrders: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await orderService.getSellerOrders(userId, page, limit);
    res.json(
      ApiResponse.success("Seller orders retrieved.", result.orders, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      })
    );
  },

  processOrder: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const order = await orderService.processOrder(userId, orderId);
    res.json(ApiResponse.success("Order is now being processed.", order));
  },

  markReadyForPickup: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const order = await orderService.markReadyForPickup(userId, orderId);
    res.json(ApiResponse.success("Order is ready for pickup.", order));
  },
};