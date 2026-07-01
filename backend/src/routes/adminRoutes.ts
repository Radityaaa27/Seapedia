import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { voucherController } from "../controllers/voucherController";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate);
router.use(requireRole("ADMIN"));

// Overview
router.get("/overview", asyncHandler(adminController.getOverview));

// Users
router.get("/users", asyncHandler(adminController.getUsers));
router.patch(
  "/users/:id/toggle",
  asyncHandler(adminController.toggleUserActive)
);
router.post(
  "/users/:id/roles",
  asyncHandler(adminController.assignRole)
);

// Overdue orders
router.get(
  "/orders/overdue",
  asyncHandler(adminController.getOverdueOrders)
);
router.patch(
  "/orders/:id/force-cancel",
  asyncHandler(adminController.forceCancelOrder)
);

// Simulate next day (manual trigger for the auto refund/return job)
router.post(
  "/simulate-next-day",
  asyncHandler(adminController.simulateNextDay)
);

// Vouchers (admin)
router.get("/vouchers", asyncHandler(voucherController.getAll));
router.post("/vouchers", asyncHandler(voucherController.create));
router.patch(
  "/vouchers/:id/toggle",
  asyncHandler(voucherController.toggle)
);

// Promos (admin)
router.get("/promos", asyncHandler(voucherController.getAllPromos));
router.post("/promos", asyncHandler(voucherController.createPromo));
router.patch(
  "/promos/:id/toggle",
  asyncHandler(voucherController.togglePromo)
);

//Overdue Check (admin)
router.post(
  "/orders/run-overdue-check",
  asyncHandler(adminController.runOverdueCheck)
)

export default router;