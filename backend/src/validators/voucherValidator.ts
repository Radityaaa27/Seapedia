import { z } from "zod";

export const createVoucherSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code must be at most 20 characters")
    .toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z
    .number()
    .positive("Value must be positive")
    .max(100, "Percentage cannot exceed 100")
    .or(z.number().positive()),
  minOrderAmount: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const createPromoSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  bannerUrl: z.string().url().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export type CreateVoucherInput = z.infer<typeof createVoucherSchema>;
export type CreatePromoInput = z.infer<typeof createPromoSchema>;