import { Router } from "express";
import { roleController } from "../controllers/roleController";
import { authenticate } from "../middleware/authenticate";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// All role routes require authentication
router.use(authenticate);

router.get("/", asyncHandler(roleController.getMyRoles));
router.post("/switch", asyncHandler(roleController.switchRole));
router.post("/add", asyncHandler(roleController.addRole));

export default router;