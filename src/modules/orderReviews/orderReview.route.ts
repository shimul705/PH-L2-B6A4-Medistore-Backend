import { Router } from "express";
import { ReviewController } from "../reviews/review.controller";
import { requireAuth, requireRole } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReviewValidation } from "../reviews/review.validation";

const router = Router();

// Aliases for frontend compatibility
router.get("/feed", ReviewController.getFeed);
router.get("/", ReviewController.getForMedicine);

router.post(
  "/order/:orderId",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(ReviewValidation.createFromOrder),
  ReviewController.createFromOrder
);

router.post("/", requireAuth, requireRole("CUSTOMER"), validateRequest(ReviewValidation.create), ReviewController.create);

export default router;
