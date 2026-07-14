import { Router } from "express";
import { productController } from "../controllers/productController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Public
router.get("/", asyncHandler(productController.getProducts));

// Seller only — must be registered BEFORE the public "/:storeSlug/:productSlug"
// route below, otherwise it would be swallowed by that route instead.
router.get(
  "/manage/:id",
  authenticate,
  requireRole("SELLER"),
  asyncHandler(productController.getProductById)
);

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