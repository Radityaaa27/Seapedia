import { Router } from "express";
import authRoutes from "./auth.routes";
import roleRoutes from "./roleRoutes";
import storeRoutes from "./storeRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/stores", storeRoutes);

export default router;