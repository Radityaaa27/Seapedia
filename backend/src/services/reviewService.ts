import { reviewRepository } from "../repositories/reviewRepository";
import { CreateReviewInput } from "../validators/reviewValidator";

export const reviewService = {
  submitReview: async (userId: string | null, input: CreateReviewInput) => {
    return reviewRepository.create(userId, input);
  },

  getPublicReviews: async (limit = 20) => {
    const [reviews, total] = await Promise.all([
      reviewRepository.findPublished(limit),
      reviewRepository.countPublished(),
    ]);

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      reviews,
      total,
      avgRating: Number(avgRating.toFixed(2)),
    };
  },
};