import { Router } from "express";
import { storeController } from "../controllers/storeController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Public
router.get("/:slug", asyncHandler(storeController.getBySlug));

// Protected — any logged-in user can create a store
// (service layer adds SELLER role automatically)
router.post(
  "/",
  authenticate,
  asyncHandler(storeController.create)
);

// Protected — must be a seller
router.get(
  "/my/store",
  authenticate,
  requireRole("SELLER"),
  asyncHandler(storeController.getMyStore)
);

router.put(
  "/my/store",
  authenticate,
  requireRole("SELLER"),
  asyncHandler(storeController.update)
);

export default router;