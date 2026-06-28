import { Router } from "express";
import { authController } from "../controllers/authController";
import { authenticate } from "../middleware/authenticate";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Public routes — no token required
router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));

// Protected route — token required
router.get("/me", authenticate, asyncHandler(authController.me));

export default router;