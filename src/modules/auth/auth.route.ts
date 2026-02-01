import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post("/register", validateRequest(AuthValidation.register), AuthController.register);
router.post("/login", validateRequest(AuthValidation.login), AuthController.login);
router.get("/me", AuthController.me);

export default router;
