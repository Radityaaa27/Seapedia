import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

// Used after authenticate middleware to restrict endpoints by role.
// Usage: router.post("/", authenticate, requireRole("SELLER"), handler)

export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const activeRole = (req as any).user?.activeRole;
    if (!activeRole || !roles.includes(activeRole)) {
      throw ApiError.forbidden(
        `This action requires one of these roles: ${roles.join(", ")}.`
      );
    }
    next();
  };
};