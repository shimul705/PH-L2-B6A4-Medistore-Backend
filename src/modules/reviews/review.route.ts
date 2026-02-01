import { Router } from "express";
import { ReviewController } from "./review.controller";
import { requireAuth, requireRole } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";

const router = Router();

router.get("/", ReviewController.getForMedicine);
router.post(
  "/",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(ReviewValidation.create),
  ReviewController.create
);

export default router;
