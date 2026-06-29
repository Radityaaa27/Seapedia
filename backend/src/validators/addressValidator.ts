import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1, "Label is required").max(30),
  recipientName: z.string().min(2, "Recipient name is required").max(50),
  phone: z.string().min(8, "Phone number is required").max(20),
  street: z.string().min(5, "Street address is required").max(200),
  city: z.string().min(2, "City is required").max(50),
  province: z.string().min(2, "Province is required").max(50),
  postalCode: z.string().min(5, "Postal code is required").max(10),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;