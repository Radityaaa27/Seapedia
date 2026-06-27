import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

// Controllers are thin — they only:
// 1. Parse and validate the request
// 2. Call the service
// 3. Send the response
// No business logic lives here.

export const authController = {
  register: async (req: Request, res: Response) => {
    // Validate request body against our Zod schema
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues[0].message;
      throw ApiError.badRequest(message);
    }

    const result = await authService.register(parsed.data);

    res.status(201).json(
      ApiResponse.success("Account created successfully.", result)
    );
  },

  login: async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues[0].message;
      throw ApiError.badRequest(message);
    }

    const result = await authService.login(parsed.data);

    res.status(200).json(
      ApiResponse.success("Login successful.", result)
    );
  },

  me: async (req: Request, res: Response) => {
    // req.user is attached by the authenticate middleware
    const userId = (req as any).user.userId;
    const user = await authService.getMe(userId);

    res.status(200).json(
      ApiResponse.success("Profile retrieved successfully.", user)
    );
  },
};