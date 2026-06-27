import { prisma } from "../lib/prisma";
import { RegisterInput } from "../validators/auth.validator";
import { RoleType } from "../generated/prisma";

// The repository layer is the ONLY place that talks to Prisma directly.
// Services call repositories — they never call prisma directly.
// This makes it easy to swap databases or mock data in tests.

export const userRepository = {
  // Find a user by email — used during login
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,  // always load roles with the user
      },
    });
  },

  // Find a user by ID — used in the /me endpoint
  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });
  },

  // Create user + default BUYER role + wallet in one transaction.
  // A transaction means: if ANY step fails, ALL steps are rolled back.
  // We never want a user without a wallet, or a wallet without a user.
  createWithDefaults: async (input: RegisterInput, hashedPassword: string) => {
    return prisma.$transaction(async (tx) => {
      // 1. Create the user
      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          phone: input.phone,
        },
      });

      // 2. Assign default BUYER role
      await tx.userRole.create({
        data: {
          userId: user.id,
          role: RoleType.BUYER,
          isActive: true,
        },
      });

      // 3. Create wallet with zero balance
      await tx.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      });

      // 4. Return user with roles included
      return tx.user.findUnique({
        where: { id: user.id },
        include: { roles: true },
      });
    });
  },
};