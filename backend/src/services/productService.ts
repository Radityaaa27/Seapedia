import { productRepository } from "../repositories/productRepository";
import { storeRepository } from "../repositories/storeRepository";
import { CreateProductInput, UpdateProductInput, ProductQuery } from "../validators/productValidator";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";

export const productService = {
  getProducts: async (query: ProductQuery) => {
    return productRepository.findMany(query);
  },

  getProductBySlug: async (storeSlug: string, productSlug: string) => {
    // First find the store
    const store = await storeRepository.findBySlug(storeSlug);
    if (!store) throw ApiError.notFound("Store not found.");

    const product = await productRepository.findBySlug(store.id, productSlug);
    if (!product || !product.isActive) {
      throw ApiError.notFound("Product not found.");
    }
    return product;
  },

  createProduct: async (userId: string, input: CreateProductInput) => {
    // Get seller's store
    const store = await storeRepository.findByUserId(userId);
    if (!store) throw ApiError.notFound("You need a store to add products.");
    if (!store.isActive) throw ApiError.forbidden("Your store is not active.");

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });
    if (!category) throw ApiError.badRequest("Invalid category.");

    return productRepository.create(store.id, input);
  },

  updateProduct: async (userId: string, productId: string, input: UpdateProductInput) => {
    // Verify ownership
    const product = await productRepository.findById(productId);
    if (!product) throw ApiError.notFound("Product not found.");

    const store = await storeRepository.findByUserId(userId);
    if (!store || product.storeId !== store.id) {
      throw ApiError.forbidden("You do not own this product.");
    }

    return productRepository.update(productId, input);
  },

  deleteProduct: async (userId: string, productId: string) => {
    const product = await productRepository.findById(productId);
    if (!product) throw ApiError.notFound("Product not found.");

    const store = await storeRepository.findByUserId(userId);
    if (!store || product.storeId !== store.id) {
      throw ApiError.forbidden("You do not own this product.");
    }

    return productRepository.delete(productId);
  },
};