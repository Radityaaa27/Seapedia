import { Request, Response } from "express";
import { cartService } from "../services/cartService";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const cartController = {
  getCart: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const cart = await cartService.getCart(userId);
    res.json(ApiResponse.success("Cart retrieved.", cart));
  },

  addItem: async (req: Request, res: Response) => {
    const { productId, quantity = 1 } = req.body;
    if (!productId) throw ApiError.badRequest("Product ID is required.");
    if (quantity < 1) throw ApiError.badRequest("Quantity must be at least 1.");

    const userId = (req as any).user.userId;
    const item = await cartService.addItem(userId, productId, quantity);
    res.status(201).json(ApiResponse.success("Item added to cart.", item));
  },

  updateItem: async (req: Request, res: Response) => {
    const { quantity } = req.body;
    if (!quantity) throw ApiError.badRequest("Quantity is required.");

    const userId = (req as any).user.userId;
    const itemId = Array.isArray(req.params.itemId)
      ? req.params.itemId[0]
      : req.params.itemId;

    const item = await cartService.updateItem(userId, itemId, quantity);
    res.json(ApiResponse.success("Cart item updated.", item));
  },

  removeItem: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const itemId = Array.isArray(req.params.itemId)
      ? req.params.itemId[0]
      : req.params.itemId;

    await cartService.removeItem(userId, itemId);
    res.json(ApiResponse.success("Item removed from cart."));
  },

  clearCart: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    await cartService.clearCart(userId);
    res.json(ApiResponse.success("Cart cleared."));
  },
};