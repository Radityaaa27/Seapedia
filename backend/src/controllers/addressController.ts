import { Request, Response } from "express";
import { addressService } from "../services/addressService";
import { addressSchema } from "../validators/addressValidator";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const addressController = {
  getAll: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const addresses = await addressService.getAddresses(userId);
    res.json(ApiResponse.success("Addresses retrieved.", addresses));
  },

  create: async (req: Request, res: Response) => {
    const parsed = addressSchema.safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.issues[0].message);
    }
    const userId = (req as any).user.userId;
    const address = await addressService.createAddress(userId, parsed.data);
    res.status(201).json(ApiResponse.success("Address created.", address));
  },

  update: async (req: Request, res: Response) => {
    const parsed = addressSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.issues[0].message);
    }
    const userId = (req as any).user.userId;
    const addressId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const address = await addressService.updateAddress(
      userId,
      addressId,
      parsed.data
    );
    res.json(ApiResponse.success("Address updated.", address));
  },

  delete: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const addressId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    await addressService.deleteAddress(userId, addressId);
    res.json(ApiResponse.success("Address deleted."));
  },

  setDefault: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const addressId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const address = await addressService.setDefault(userId, addressId);
    res.json(ApiResponse.success("Default address updated.", address));
  },
};