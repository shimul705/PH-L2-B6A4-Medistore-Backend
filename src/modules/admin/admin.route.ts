import { Router } from "express";
import { AdminController } from "./admin.controller";
import { requireAuth, requireRole } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { AdminValidation } from "./admin.validation";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

router.get("/users", AdminController.getUsers);
router.patch("/users/:id", validateRequest(AdminValidation.updateUserStatus), AdminController.updateUserStatus);
router.get("/medicines", AdminController.getMedicines);
router.get("/orders", AdminController.getOrders);

export default router;
