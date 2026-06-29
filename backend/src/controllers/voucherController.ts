import { Request, Response } from "express";
import { voucherService } from "../services/voucherService";
import { createVoucherSchema, createPromoSchema } from "../validators/voucherValidator";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const voucherController = {
  // ── Vouchers ─────────────────────────────────────────────

  getAll: async (_req: Request, res: Response) => {
    const vouchers = await voucherService.getAllVouchers();
    res.json(ApiResponse.success("Vouchers retrieved.", vouchers));
  },

  getActive: async (_req: Request, res: Response) => {
    const vouchers = await voucherService.getActiveVouchers();
    res.json(ApiResponse.success("Active vouchers retrieved.", vouchers));
  },

  validate: async (req: Request, res: Response) => {
    const { code, orderAmount } = req.body;
    if (!code) throw ApiError.badRequest("Voucher code is required.");
    if (!orderAmount) throw ApiError.badRequest("Order amount is required.");
    const result = await voucherService.validateVoucher(code, Number(orderAmount));
    res.json(ApiResponse.success("Voucher is valid.", result));
  },

  create: async (req: Request, res: Response) => {
    const parsed = createVoucherSchema.safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.issues[0].message);
    }
    const voucher = await voucherService.createVoucher(parsed.data);
    res.status(201).json(ApiResponse.success("Voucher created.", voucher));
  },

  toggle: async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const voucher = await voucherService.toggleVoucher(id);
    res.json(ApiResponse.success("Voucher status updated.", voucher));
  },

  // ── Promos ────────────────────────────────────────────────

  getActivePromos: async (_req: Request, res: Response) => {
    const promos = await voucherService.getActivePromos();
    res.json(ApiResponse.success("Active promos retrieved.", promos));
  },

  getAllPromos: async (_req: Request, res: Response) => {
    const promos = await voucherService.getAllPromos();
    res.json(ApiResponse.success("All promos retrieved.", promos));
  },

  createPromo: async (req: Request, res: Response) => {
    const parsed = createPromoSchema.safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.issues[0].message);
    }
    const promo = await voucherService.createPromo(parsed.data);
    res.status(201).json(ApiResponse.success("Promo created.", promo));
  },

  togglePromo: async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const promo = await voucherService.togglePromo(id);
    res.json(ApiResponse.success("Promo status updated.", promo));
  },
};