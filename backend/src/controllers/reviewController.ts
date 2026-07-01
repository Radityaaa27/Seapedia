import { Request, Response } from "express";
import { reviewService } from "../services/reviewService";
import { createReviewSchema } from "../validators/reviewValidator";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const reviewController = {
  create: async (req: Request, res: Response) => {
    const parsed = createReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.issues[0].message);
    }

    // Guests are allowed — userId is null if not logged in
    const userId = (req as any).user?.userId ?? null;

    const review = await reviewService.submitReview(userId, parsed.data);
    res
      .status(201)
      .json(ApiResponse.success("Thanks for your review!", review));
  },

  getAll: async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const result = await reviewService.getPublicReviews(limit);
    res.json(ApiResponse.success("Reviews retrieved.", result));
  },
};