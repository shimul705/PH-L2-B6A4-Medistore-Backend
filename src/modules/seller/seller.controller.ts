import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { OrderService } from "../orders/order.service";

export const SellerController = {
  getOrders: asyncHandler(async (req: Request, res: Response) => {
    const data = await OrderService.getMyOrders(req.user!);
    res.json({ success: true, data });
  }),

  updateOrderStatus: asyncHandler(async (req: Request, res: Response) => {
    const data = await OrderService.updateStatus(req.user!, req.params.id, req.body.status);
    res.json({ success: true, data });
  }),
};
