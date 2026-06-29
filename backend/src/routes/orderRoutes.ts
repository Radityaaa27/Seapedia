import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate);

// Buyer routes
router.post(
  "/",
  requireRole("BUYER"),
  asyncHandler(orderController.createOrder)
);
router.get(
  "/",
  requireRole("BUYER"),
  asyncHandler(orderController.getMyOrders)
);
router.get(
  "/:id",
  asyncHandler(orderController.getOrderDetail)
);
router.patch(
  "/:id/cancel",
  requireRole("BUYER"),
  asyncHandler(orderController.cancelOrder)
);

// Seller routes
router.get(
  "/seller/orders",
  requireRole("SELLER"),
  asyncHandler(orderController.getSellerOrders)
);
router.patch(
  "/:id/process",
  requireRole("SELLER"),
  asyncHandler(orderController.processOrder)
);
router.patch(
  "/:id/ready",
  requireRole("SELLER"),
  asyncHandler(orderController.markReadyForPickup)
);

export default router;