import { Router } from "express";
import { voucherController } from "../controllers/voucherController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Public — buyers can see active promos
router.get("/promos/active", asyncHandler(voucherController.getActivePromos));

// Authenticated — buyers validate vouchers at checkout
router.post(
  "/validate",
  authenticate,
  asyncHandler(voucherController.validate)
);
router.get(
  "/active",
  authenticate,
  asyncHandler(voucherController.getActive)
);

// Admin only
router.get(
  "/",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(voucherController.getAll)
);
router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(voucherController.create)
);
router.patch(
  "/:id/toggle",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(voucherController.toggle)
);

router.get(
  "/promos",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(voucherController.getAllPromos)
);
router.post(
  "/promos",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(voucherController.createPromo)
);
router.patch(
  "/promos/:id/toggle",
  authenticate,
  requireRole("ADMIN"),
  asyncHandler(voucherController.togglePromo)
);

export default router;