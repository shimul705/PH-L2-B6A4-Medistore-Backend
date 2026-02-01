import { Router } from "express";
import { MedicineController } from "./medicine.controller";
import { requireAuth, requireRole } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { MedicineValidation } from "./medicine.validation";

const router = Router();

// Public
router.get("/", MedicineController.getAll);
router.get("/:id", MedicineController.getById);

// Seller inventory (also allow Admin)
router.post(
  "/",
  requireAuth,
  requireRole("SELLER", "ADMIN"),
  validateRequest(MedicineValidation.create),
  MedicineController.create
);

router.put(
  "/:id",
  requireAuth,
  requireRole("SELLER", "ADMIN"),
  validateRequest(MedicineValidation.update),
  MedicineController.update
);

router.delete("/:id", requireAuth, requireRole("SELLER", "ADMIN"), MedicineController.remove);

export default router;
