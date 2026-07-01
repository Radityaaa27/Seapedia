import { Router } from "express";
import { reviewController } from "../controllers/reviewController";
import { optionalAuthenticate } from "../middleware/guest";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Public — guests and logged-in users may submit an app review
router.post("/", optionalAuthenticate, asyncHandler(reviewController.create));

// Public — anyone can see published app reviews
router.get("/", asyncHandler(reviewController.getAll));

export default router;