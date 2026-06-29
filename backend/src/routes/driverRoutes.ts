import { Router } from "express";
import { driverController } from "../controllers/driverController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate);
router.use(requireRole("DRIVER"));

// Available jobs (any driver can browse)
router.get("/jobs", asyncHandler(driverController.getAvailableJobs));
router.get("/jobs/active", asyncHandler(driverController.getActiveJob));
router.get("/jobs/history", asyncHandler(driverController.getMyJobs));
router.get("/jobs/:id", asyncHandler(driverController.getJobDetail));

// Take a job
router.patch("/jobs/:id/take", asyncHandler(driverController.takeJob));

// Complete a job
router.patch("/jobs/:id/complete", asyncHandler(driverController.completeJob));

// Earnings
router.get("/earnings", asyncHandler(driverController.getEarnings));

export default router;