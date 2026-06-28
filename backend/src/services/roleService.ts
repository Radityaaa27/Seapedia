import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt.util";
import { RoleType } from "../generated/prisma";

export const roleService = {
  // Get all roles belonging to a user
  getUserRoles: async (userId: string) => {
    const roles = await prisma.userRole.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    if (!roles.length) throw ApiError.notFound("No roles found for this user.");
    return roles;
  },

  // Switch the user's active role and return a new JWT
  switchRole: async (userId: string, newRole: RoleType) => {
    // 1. Check the user actually has this role
    const userRole = await prisma.userRole.findUnique({
      where: { userId_role: { userId, role: newRole } },
    });
    if (!userRole) {
      throw ApiError.forbidden("You do not have the requested role.");
    }

    // 2. Deactivate all roles for this user
    await prisma.userRole.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    // 3. Activate the selected role
    await prisma.userRole.update({
      where: { userId_role: { userId, role: newRole } },
      data: { isActive: true },
    });

    // 4. Fetch updated user for token payload
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });
    if (!user) throw ApiError.notFound("User not found.");

    // 5. Issue a new token with the updated active role
    const token = signToken({
      userId: user.id,
      email: user.email,
      activeRole: newRole,
    });

    const { password, ...safeUser } = user;
    return { token, user: safeUser };
  },

  // Add a new role to an existing user (e.g. buyer becomes seller)
  addRole: async (userId: string, newRole: RoleType) => {
    // Check if already has this role
    const existing = await prisma.userRole.findUnique({
      where: { userId_role: { userId, role: newRole } },
    });
    if (existing) {
      throw ApiError.conflict(`You already have the ${newRole} role.`);
    }

    const role = await prisma.userRole.create({
      data: { userId, role: newRole, isActive: false },
    });
    return role;
  },
};