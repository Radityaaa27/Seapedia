import { Router } from "express";
import { productController } from "../controllers/productController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Public
router.get("/", asyncHandler(productController.getProducts));
router.get(
  "/:storeSlug/:productSlug",
  asyncHandler(productController.getProductBySlug)
);

// Seller only
router.post(
  "/",
  authenticate,
  requireRole("SELLER"),
  asyncHandler(productController.createProduct)
);

router.put(
  "/:id",
  authenticate,
  requireRole("SELLER"),
  asyncHandler(productController.updateProduct)
);

router.delete(
  "/:id",
  authenticate,
  requireRole("SELLER"),
  asyncHandler(productController.deleteProduct)
);

export default router;