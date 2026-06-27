import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";
import { ApiError } from "../utils/ApiError";

// This middleware protects routes that require login.
// It reads the JWT from the Authorization header,
// verifies it, and attaches the decoded payload to req.user.
//
// Usage: router.get("/me", authenticate, asyncHandler(controller.me))

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // The standard format is: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.unauthorized("No token provided. Please log in.");
  }

  const token = authHeader.split(" ")[1];

  // verifyToken throws ApiError if the token is invalid or expired
  const decoded = verifyToken(token);

  // Attach decoded payload to request so controllers can access it
  (req as any).user = decoded;

  next();
};