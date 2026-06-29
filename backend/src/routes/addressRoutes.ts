import { Router } from "express";
import { addressController } from "../controllers/addressController";
import { authenticate } from "../middleware/authenticate";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(addressController.getAll));
router.post("/", asyncHandler(addressController.create));
router.put("/:id", asyncHandler(addressController.update));
router.delete("/:id", asyncHandler(addressController.delete));
router.patch("/:id/default", asyncHandler(addressController.setDefault));

export default router;