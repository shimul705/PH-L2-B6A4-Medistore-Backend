import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post("/register", validateRequest(AuthValidation.register), AuthController.register);
router.post("/login", validateRequest(AuthValidation.login), AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", AuthController.me);
router.get("/google", AuthController.google);

export default router;
