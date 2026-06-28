import { Request, Response } from "express";
import { roleService } from "../services/roleService";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { RoleType } from "../generated/prisma";

export const roleController = {
  // GET /api/roles — get all roles for current user
  getMyRoles: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const roles = await roleService.getUserRoles(userId);
    res.json(ApiResponse.success("Roles retrieved.", roles));
  },

  // POST /api/roles/switch — switch active role
  switchRole: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { role } = req.body;

    if (!role || !Object.values(RoleType).includes(role)) {
      throw ApiError.badRequest("Invalid role provided.");
    }

    const result = await roleService.switchRole(userId, role as RoleType);
    res.json(ApiResponse.success(`Switched to ${role} successfully.`, result));
  },

  // POST /api/roles/add — register a new role for current user
  addRole: async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { role } = req.body;

    if (!role || !Object.values(RoleType).includes(role)) {
      throw ApiError.badRequest("Invalid role provided.");
    }

    // Prevent users from self-assigning ADMIN
    if (role === RoleType.ADMIN) {
      throw ApiError.forbidden("Cannot self-assign the ADMIN role.");
    }

    const result = await roleService.addRole(userId, role as RoleType);
    res.json(ApiResponse.success(`${role} role added successfully.`, result));
  },
};