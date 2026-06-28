import prisma from "../lib/prisma";
import { CreateStoreInput,UpdateStoreInput } from "../validators/storeValidator";

export const storeRepository = {
    findByName: async (name:string) => {
        return prisma.store.findUnique({ where: {name} });
    },
    findBySlug: async (slug:string) => {
        return prisma.store.findUnique({
            where: {slug},
            include: {
                user:{
                    select: {id: true,name: true, avatarUrl:true},
                },
                products: {
                    where: {isActive: true},
                    include: {images: true},
                    take: 20,
                },
            },
        });
    },
    findByUserId: async (userId:string) =>{
        return prisma.store.findUnique({
            where: {userId},
            include: {
                products: {
                    where: {isActive:true},
                    include: {images: true},
                    orderBy: {createdAt: "desc"},
                },
            },
        });
    },
    create: async (userId:string, input:CreateStoreInput) =>{
        return prisma.store.create({
            data: {
                userId,
                name: input.name,
                slug: input.slug,
                description: input.description,
            },
        });
    },
   update: async (userId: string, input: UpdateStoreInput) => {
    return prisma.store.update({
      where: { userId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.logoUrl && { logoUrl: input.logoUrl }),
        ...(input.bannerUrl && { bannerUrl: input.bannerUrl }),
      },
    });
  },
};