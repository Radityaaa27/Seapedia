export interface AppReview {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewInput {
  reviewerName: string;
  rating: number;
  comment: string;
}

export interface ReviewListResponse {
  reviews: AppReview[];
  total: number;
  avgRating: number;
}