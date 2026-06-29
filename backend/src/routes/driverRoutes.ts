import { Router } from "express";
import { driverController } from "../controllers/driverController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate);
router.use(requireRole("DRIVER"));

router.get("/jobs/available", asyncHandler(driverController.getAvailableJobs));
router.get("/jobs/my", asyncHandler(driverController.getMyJobs));
router.post("/jobs/:id/accept", asyncHandler(driverController.acceptJob));
router.patch("/jobs/:id/pickup", asyncHandler(driverController.pickUpOrder));
router.patch(
  "/jobs/:id/complete",
  asyncHandler(driverController.completeDelivery)
);
router.get("/earnings", asyncHandler(driverController.getEarnings));

export default router;