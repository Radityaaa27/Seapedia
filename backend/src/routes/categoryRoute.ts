import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(categoryController.getAll));

// Only admin can create categories
router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(categoryController.create)
);

export default router;