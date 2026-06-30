import { z } from "zod";

export const topUpSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .min(10000, "Minimum top up is Rp 10.000")
    .max(10000000, "Maximum top up is Rp 10.000.000"),
});

export type TopUpInput = z.infer<typeof topUpSchema>;