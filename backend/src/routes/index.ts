import { Router } from "express";
import authRoutes from "./authRoutes";
import roleRoutes from "./roleRoutes";
import storeRoutes from "./storeRoutes";
import productRoutes from "./productRoutes";
import categoryRoutes from "./categoryRoutes";
import walletRoutes from "./walletRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/stores", storeRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/wallet", walletRoutes);

export default router;