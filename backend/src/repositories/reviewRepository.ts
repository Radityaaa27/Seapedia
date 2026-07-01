import prisma from "../lib/prisma";
import { CreateReviewInput } from "../validators/reviewValidator";

export const reviewRepository = {
  create: async (userId: string | null, input: CreateReviewInput) => {
    return prisma.appReview.create({
      data: {
        userId: userId ?? undefined,
        reviewerName: input.reviewerName,
        rating: input.rating,
        comment: input.comment,
      },
    });
  },

  findPublished: async (limit: number) => {
    return prisma.appReview.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  countPublished: async () => {
    return prisma.appReview.count({ where: { isPublished: true } });
  },
};