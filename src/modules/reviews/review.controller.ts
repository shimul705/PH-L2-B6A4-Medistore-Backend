import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { ReviewService } from "./review.service";
import { ApiError } from "../../utils/ApiError";

export const ReviewController = {
  getForMedicine: asyncHandler(async (req: Request, res: Response) => {
    const medicineId = String(req.query.medicineId || "");
    if (!medicineId) throw new ApiError(400, "medicineId query param is required");
    const data = await ReviewService.getForMedicine(medicineId);
    res.json({ success: true, data });
  }),


  getFeed: asyncHandler(async (req: Request, res: Response) => {
    const limit = Number(req.query.limit || 10);
    const data = await ReviewService.getFeed(Number.isFinite(limit) ? limit : 10);
    res.json({ success: true, data });
  }),

  createFromOrder: asyncHandler(async (req: Request, res: Response) => {
    const orderId = String(req.params.orderId);
    const data = await ReviewService.createFromOrder(req.user!, orderId, req.body);
    res.status(201).json({ success: true, data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await ReviewService.create(req.user!, req.body);
    res.status(201).json({ success: true, data });
  }),
};
