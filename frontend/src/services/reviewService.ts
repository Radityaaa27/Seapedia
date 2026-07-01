import api from "./api";
import { AppReview, CreateReviewInput, ReviewListResponse } from "../types/reviewTypes";

export const reviewService = {
  submitReview: async (input: CreateReviewInput): Promise<AppReview> => {
    const res = await api.post<{ data: AppReview }>("/reviews", input);
    return res.data.data;
  },

  getReviews: async (limit = 20): Promise<ReviewListResponse> => {
    const res = await api.get<{ data: ReviewListResponse }>("/reviews", {
      params: { limit },
    });
    return res.data.data;
  },
};