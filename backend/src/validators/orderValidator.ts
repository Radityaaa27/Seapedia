import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().min(1, "Delivery address is required"),
  storeId: z.string().min(1, "Store ID is required"),
  items: z
    .array(
      z.object({
        cartItemId: z.string(),
        productId: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "At least one item is required"),
  voucherId: z.string().optional(),
  notes: z.string().max(200).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Delivery fee: Rp 1.000 per 100g, minimum Rp 5.000
export const calculateDeliveryFee = (totalWeightGrams: number): number => {
  const base = Math.ceil(totalWeightGrams / 100) * 1000;
  return Math.max(base, 5000);
};

// PPN 11%
export const PPN_RATE = 0.11;