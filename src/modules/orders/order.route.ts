import { Router } from "express";
import { OrderController } from "./order.controller";
import { requireAuth, requireRole } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { OrderValidation } from "./order.validation";

const router = Router();

router.post("/", requireAuth, requireRole("CUSTOMER"), validateRequest(OrderValidation.create), OrderController.create);
router.get("/", requireAuth, OrderController.getMy);
router.get("/:id", requireAuth, OrderController.getById);

router.patch(
  "/:id",
  requireAuth,
  requireRole("SELLER", "ADMIN"),
  validateRequest(OrderValidation.updateStatus),
  OrderController.updateStatus
);

export default router;
