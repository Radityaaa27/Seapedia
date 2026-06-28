import { prisma } from "../lib/prisma";
import { CreateProductInput, UpdateProductInput, ProductQuery } from "../validators/productValidator";
import { Prisma } from "../generated/prisma";

export const productRepository = {
  // Public product list with filtering, search, pagination
  findMany: async (query: ProductQuery) => {
    const { page, limit, search, categoryId, storeId, minPrice, maxPrice, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Build where clause dynamically
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(storeId && { storeId }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
          store: { select: { id: true, name: true, slug: true } },
          reviews: { select: { rating: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  },

  findBySlug: async (storeId: string, slug: string) => {
    return prisma.product.findUnique({
      where: { storeId_slug: { storeId, slug } },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
        store: { select: { id: true, name: true, slug: true, logoUrl: true } },
        reviews: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.product.findUnique({
      where: { id },
      include: { images: true, store: true },
    });
  },

  create: async (storeId: string, input: CreateProductInput) => {
    // Generate slug from name
    const slug = input.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          storeId,
          categoryId: input.categoryId,
          name: input.name,
          slug,
          description: input.description,
          price: input.price,
          stock: input.stock,
          weight: input.weight,
        },
      });

      // Create images — ensure only one is primary
      if (input.images.length > 0) {
        await tx.productImage.createMany({
          data: input.images.map((img, index) => ({
            productId: product.id,
            url: img.url,
            isPrimary: index === 0 ? true : img.isPrimary,
            order: index,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: { images: true, category: true },
      });
    });
  },

  update: async (id: string, input: UpdateProductInput) => {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.price !== undefined && { price: input.price }),
          ...(input.stock !== undefined && { stock: input.stock }),
          ...(input.weight !== undefined && { weight: input.weight }),
          ...(input.categoryId && { categoryId: input.categoryId }),
          ...(input.isActive !== undefined && { isActive: input.isActive }),
        },
      });

      // Replace images if provided
      if (input.images && input.images.length > 0) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: input.images.map((img, index) => ({
            productId: id,
            url: img.url,
            isPrimary: index === 0 ? true : img.isPrimary,
            order: index,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: { images: true, category: true },
      });
    });
  },

  delete: async (id: string) => {
    // Soft delete — set isActive to false
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  },
};