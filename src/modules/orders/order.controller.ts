import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { OrderService } from "./order.service";

export const OrderController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await OrderService.create(req.user!, req.body);
    res.status(201).json({ success: true, data });
  }),

  getMy: asyncHandler(async (req: Request, res: Response) => {
    const data = await OrderService.getMyOrders(req.user!);
    res.json({ success: true, data });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const data = await OrderService.getById(req.user!, req.params.id as string);
    res.json({ success: true, data });
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const data = await OrderService.updateStatus(req.user!, req.params.id as string, req.body.status);
    res.json({ success: true, data });
  }),
};
