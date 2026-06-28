import { Router } from "express";
import { walletController } from "../controllers/walletController";
import { authenticate } from "../middleware/authenticate";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// All wallet routes require authentication
router.use(authenticate);

router.get("/", asyncHandler(walletController.getWallet));
router.post("/topup", asyncHandler(walletController.topUp));
router.get("/transactions", asyncHandler(walletController.getTransactions));

export default router;