import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters").max(100),
  description: z.string().max(2000).optional(),
 price: z
  .number()
  .positive("Price must be greater than 0")
  .max(999999999, "Price is too high"),
stock: z
  .number()
  .int("Stock must be a whole number")
  .min(0, "Stock cannot be negative"),
weight: z
  .number()
  .positive("Weight must be greater than 0"),
  categoryId: z.string().min(1, "Category is required"),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
        isPrimary: z.boolean().default(false),
      })
    )
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
});

export const updateProductSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().positive().max(999999999).optional(),
  stock: z.number().int().min(0).optional(),
  weight: z.number().positive().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        isPrimary: z.boolean().default(false),
      })
    )
    .optional(),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  storeId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z.enum(["createdAt", "price", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;