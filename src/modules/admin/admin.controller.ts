import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { AdminService } from "./admin.service";

export const AdminController = {
  getUsers: asyncHandler(async (_req: Request, res: Response) => {
    const data = await AdminService.getUsers();
    res.json({ success: true, data });
  }),

  updateUserStatus: asyncHandler(async (req: Request, res: Response) => {
    const data = await AdminService.updateUserStatus(req.params.id, req.body.isBanned);
    res.json({ success: true, data });
  }),

  getMedicines: asyncHandler(async (_req: Request, res: Response) => {
    const data = await AdminService.getAllMedicines();
    res.json({ success: true, data });
  }),

  getOrders: asyncHandler(async (_req: Request, res: Response) => {
    const data = await AdminService.getAllOrders();
    res.json({ success: true, data });
  }),
};
