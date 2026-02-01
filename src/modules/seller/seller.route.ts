import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { OrderValidation } from "../orders/order.validation";
import { MedicineController } from "../medicines/medicine.controller";
import { MedicineValidation } from "../medicines/medicine.validation";
import { SellerController } from "./seller.controller";

const router = Router();

router.use(requireAuth, requireRole("SELLER"));

// Medicine inventory
router.post("/medicines", validateRequest(MedicineValidation.create), MedicineController.create);
router.put("/medicines/:id", validateRequest(MedicineValidation.update), MedicineController.update);
router.delete("/medicines/:id", MedicineController.remove);

// Orders
router.get("/orders", SellerController.getOrders);
router.patch("/orders/:id", validateRequest(OrderValidation.updateStatus), SellerController.updateOrderStatus);

export default router;
