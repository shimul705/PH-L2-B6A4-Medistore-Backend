import { Router } from "express";
import { AddressController } from "./address.controller";
import { requireAuth, requireRole } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { AddressValidation } from "./address.validation";

const router = Router();

router.get("/", requireAuth, requireRole("CUSTOMER"), AddressController.list);
router.get("/default", requireAuth, requireRole("CUSTOMER"), AddressController.getDefault);

router.post("/", requireAuth, requireRole("CUSTOMER"), validateRequest(AddressValidation.create), AddressController.create);

router.patch(
  "/:id",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(AddressValidation.update),
  AddressController.update
);

router.delete("/:id", requireAuth, requireRole("CUSTOMER"), AddressController.remove);

router.patch(
  "/:id/default",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(AddressValidation.setDefault),
  AddressController.setDefault
);

// Some clients send PUT instead of PATCH for setting default
router.put(
  "/:id/default",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(AddressValidation.setDefault),
  AddressController.setDefault
);

export default router;
