import { Router } from "express";
import authRoutes from "./authRoutes";
import roleRoutes from "./roleRoutes";
import storeRoutes from "./storeRoutes";
import productRoutes from "./productRoutes";
import categoryRoutes from "./categoryRoutes";
import walletRoutes from "./walletRoutes";
import addressRoutes from "./addressRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";
import voucherRoutes from "./voucherRoutes";
import reportRoutes from "./reportRoutes";
import driverRoutes from "./driverRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/stores", storeRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/wallet", walletRoutes);
router.use("/addresses", addressRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/reports", reportRoutes);
router.use("/driver", driverRoutes);

export default router;