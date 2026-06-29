import { Router } from "express";
import { reportController } from "../controllers/reportController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get(
  "/seller",
  authenticate,
  requireRole("SELLER"),
  asyncHandler(reportController.getSellerReport)
);

export default router;