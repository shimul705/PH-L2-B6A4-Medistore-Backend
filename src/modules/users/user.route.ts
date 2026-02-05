import { Router } from "express";
import { requireAuth } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router();

router.get("/me", requireAuth, UserController.me);
router.patch("/me", requireAuth, validateRequest(UserValidation.updateMe), UserController.updateMe);

export default router;
