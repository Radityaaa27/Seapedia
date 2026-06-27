import { Router } from "express";
import authRoutes from "./auth.routes";

// Central route registry.
// Every new feature gets added here — keeps app.ts clean.

const router = Router();

router.use("/auth", authRoutes);

export default router;