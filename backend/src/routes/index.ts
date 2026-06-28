import { Router } from "express";
import authRoutes from "./auth.routes";
import roleRoutes from "./roleRoutes";
import storeRoutes from "./storeRoutes";
import productRoutes from "./productRoute";
import categoryRoutes from "./categoryRoute";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/stores", storeRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);

export default router;