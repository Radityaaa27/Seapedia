import { z } from "zod";

// Slug: URL-friendly string, e.g. "my-cool-store"
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createStoreSchema = z.object({
  name: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(50, "Store name must be at most 50 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(slugRegex, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500).optional(),
});

export const updateStoreSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  bannerUrl: z.string().url("Invalid banner URL").optional(),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;