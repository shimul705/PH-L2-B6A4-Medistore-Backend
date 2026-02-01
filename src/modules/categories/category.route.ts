import { Router } from "express";
import { CategoryController } from "./category.controller";
import { requireAuth, requireRole } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";

const router = Router();

router.get("/", CategoryController.getAll);

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(CategoryValidation.create),
  CategoryController.create
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(CategoryValidation.update),
  CategoryController.update
);

router.delete("/:id", requireAuth, requireRole("ADMIN"), CategoryController.remove);

export default router;
