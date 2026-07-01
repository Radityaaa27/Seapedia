import { z } from "zod";

export const deliveryMethodSchema = z.enum(["INSTANT", "NEXT_DAY", "REGULAR"]);
export type DeliveryMethod = z.infer<typeof deliveryMethodSchema>;

export const createOrderSchema = z.object({
  addressId: z.string().min(1, "Delivery address is required"),
  storeId: z.string().min(1, "Store ID is required"),
  deliveryMethod: deliveryMethodSchema.default("REGULAR"),
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

// Base delivery fee: Rp 1.000 per 100g, minimum Rp 5.000
const baseFeeByWeight = (totalWeightGrams: number): number => {
  const base = Math.ceil(totalWeightGrams / 100) * 1000;
  return Math.max(base, 5000);
};

// Delivery fee differs by method:
// - INSTANT: flat surcharge on top of weight-based base fee (fastest, most expensive)
// - NEXT_DAY: smaller surcharge
// - REGULAR: weight-based fee only (cheapest)
export const calculateDeliveryFee = (
  totalWeightGrams: number,
  method: DeliveryMethod = "REGULAR"
): number => {
  const base = baseFeeByWeight(totalWeightGrams);

  switch (method) {
    case "INSTANT":
      return base + 15000;
    case "NEXT_DAY":
      return base + 5000;
    case "REGULAR":
    default:
      return base;
  }
};

// ── Overdue handling ─────────────────────────────────────────
//
// How many days an order may stay in a "not yet shipped" state
// (PAID / PROCESSING / READY_FOR_PICKUP) before it's considered
// overdue and eligible for an automatic refund. Faster delivery
// methods have a tighter deadline.
export const OVERDUE_DAYS_BY_METHOD: Record<DeliveryMethod, number> = {
  INSTANT: 1,
  NEXT_DAY: 2,
  REGULAR: 4,
};

// Extra grace period (in days) added on top of OVERDUE_DAYS_BY_METHOD
// once an order has already been shipped (ON_DELIVERY / DELIVERED) but
// the buyer never confirmed receipt. After this window the order is
// automatically returned + refunded instead of just refunded.
export const SHIPPED_GRACE_DAYS = 3;

// PPN 12%
export const PPN_RATE = 0.12;