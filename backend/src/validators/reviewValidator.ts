import { z } from "zod";

export const createReviewSchema = z.object({
  reviewerName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .trim()
    .min(5, "Comment must be at least 5 characters")
    .max(500, "Comment must be at most 500 characters"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>; 