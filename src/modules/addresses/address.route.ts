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

// Frontend triggers default selection with POST.
// Keep PATCH as well (RESTful) for compatibility.
router.post(
  "/:id/default",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(AddressValidation.setDefault),
  AddressController.setDefault
);

router.patch(
  "/:id/default",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(AddressValidation.setDefault),
  AddressController.setDefault
);

export default router;
