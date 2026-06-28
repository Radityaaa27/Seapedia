import { Request, Response } from "express";
import { storeService } from "../services/storeService";
import { createStoreSchema, updateStoreSchema } from "../validators/storeValidator";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const storeController = {
  create: async (req: Request, res: Response) => {
    const parsed = createStoreSchema.safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.issues[0].message);
    }
    const userId = (req as any).user.userId;
    const store = await storeService.createStore(userId, parsed.data);
    res.status(201).json(ApiResponse.success("Store created successfully.", store));
  },

  getMyStore: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const store = await storeService.getMyStore(userId);
    res.json(ApiResponse.success("Store retrieved.", store));
  },

getBySlug: async (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug)
    ? req.params.slug[0]
    : req.params.slug;
  const store = await storeService.getStoreBySlug(slug);
  res.json(ApiResponse.success("Store retrieved.", store));
},

  update: async (req: Request, res: Response) => {
    const parsed = updateStoreSchema.safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.issues[0].message);
    }
    const userId = (req as any).user.userId;
    const store = await storeService.updateStore(userId, parsed.data);
    res.json(ApiResponse.success("Store updated successfully.", store));
  },
};