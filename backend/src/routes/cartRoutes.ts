import { Router } from "express";
import { cartController } from "../controllers/cartController";
import { authenticate } from "../middleware/authenticate";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(cartController.getCart));
router.post("/items", asyncHandler(cartController.addItem));
router.put("/items/:itemId", asyncHandler(cartController.updateItem));
router.delete("/items/:itemId", asyncHandler(cartController.removeItem));
router.delete("/", asyncHandler(cartController.clearCart));

export default router;