import { storeRepository } from "../repositories/storeRepository";
import { CreateStoreInput, UpdateStoreInput } from "../validators/storeValidator";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { RoleType } from "../generated/prisma";

export const storeService = {
  createStore: async (userId: string, input: CreateStoreInput) => {
    // 1. User can only have one store
    const existingStore = await storeRepository.findByUserId(userId);
    if (existingStore) {
      throw ApiError.conflict("You already have a store.");
    }

    // 2. Store name must be unique
    const nameTaken = await storeRepository.findByName(input.name);
    if (nameTaken) {
      throw ApiError.conflict("This store name is already taken.");
    }

    // 3. Slug must be unique
    const slugTaken = await storeRepository.findBySlug(input.slug);
    if (slugTaken) {
      throw ApiError.conflict("This slug is already taken. Try another.");
    }

    // 4. Ensure user has SELLER role — add it if not present
    const sellerRole = await prisma.userRole.findUnique({
      where: { userId_role: { userId, role: RoleType.SELLER } },
    });
    if (!sellerRole) {
      await prisma.userRole.create({
        data: { userId, role: RoleType.SELLER, isActive: false },
      });
    }

    // 5. Create the store
    return storeRepository.create(userId, input);
  },

  getMyStore: async (userId: string) => {
    const store = await storeRepository.findByUserId(userId);
    if (!store) throw ApiError.notFound("You do not have a store yet.");
    return store;
  },

  getStoreBySlug: async (slug: string) => {
    const store = await storeRepository.findBySlug(slug);
    if (!store || !store.isActive) {
      throw ApiError.notFound("Store not found.");
    }
    return store;
  },

  updateStore: async (userId: string, input: UpdateStoreInput) => {
    // Ensure store exists
    const store = await storeRepository.findByUserId(userId);
    if (!store) throw ApiError.notFound("Store not found.");

    // Check new name isn't taken by another store
    if (input.name && input.name !== store.name) {
      const nameTaken = await storeRepository.findByName(input.name);
      if (nameTaken) throw ApiError.conflict("This store name is already taken.");
    }

    return storeRepository.update(userId, input);
  },
};