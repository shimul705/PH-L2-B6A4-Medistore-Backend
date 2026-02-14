import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { createOrderReview, getOrderReview, listOrderReviews } from "./orderReview.service";

export const OrderReviewController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const limit = Number(req.query.limit || 8);
    const data = await listOrderReviews(Number.isFinite(limit) ? limit : 8);
    res.json(new ApiResponse(true, "Reviews fetched", data));
  }),

  myForOrder: asyncHandler(async (req: Request, res: Response) => {
    const data = await getOrderReview(req.params.orderId, req.user!.id);
    res.json(new ApiResponse(true, "Review fetched", data));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await createOrderReview(req.params.orderId, req.user!.id, req.body.text);
    res.status(201).json(new ApiResponse(true, "Review submitted", data));
  }),
};
