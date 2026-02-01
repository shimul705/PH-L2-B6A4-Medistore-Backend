import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { ReviewService } from "./review.service";

export const ReviewController = {
  getForMedicine: asyncHandler(async (req: Request, res: Response) => {
    const medicineId = String(req.query.medicineId || "");
    if (!medicineId) {
      return res.status(400).json({ success: false, message: "medicineId query param is required" });
    }
    const data = await ReviewService.getForMedicine(medicineId);
    res.json({ success: true, data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await ReviewService.create(req.user!, req.body);
    res.status(201).json({ success: true, data });
  }),
};
