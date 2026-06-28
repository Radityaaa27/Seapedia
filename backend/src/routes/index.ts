import { Router } from "express";
import authRoutes from "./auth.routes";
import roleRoutes from "./roleRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);

export default router;