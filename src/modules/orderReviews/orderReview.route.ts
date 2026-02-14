import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { OrderReviewController } from "./orderReview.controller";

const router = Router();

// Order reviews shown on homepage (latest reviews)
router.get("/", OrderReviewController.list);

// Backward-compatible alias
router.get("/feed", OrderReviewController.list);

// Customer: get my review for an order
router.get("/order/:orderId", requireAuth, requireRole("CUSTOMER"), OrderReviewController.myForOrder);

// Customer: create review for an order
router.post(
  "/order/:orderId",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(
    z.object({
      body: z.object({
        // Frontend uses { text }
        text: z.string().min(1, "Review text is required"),
      }),
    })
  ),
  OrderReviewController.create
);

export default router;
