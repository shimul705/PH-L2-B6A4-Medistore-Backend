import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { MedicineService } from "./medicine.service";

export const MedicineController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const data = await MedicineService.getAll(req.query);
    res.json({ success: true, data });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const data = await MedicineService.getById(req.params.id);
    res.json({ success: true, data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await MedicineService.create(req.user!, req.body);
    res.status(201).json({ success: true, data });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await MedicineService.update(req.user!, req.params.id, req.body);
    res.json({ success: true, data });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await MedicineService.remove(req.user!, req.params.id);
    res.status(204).send();
  }),
};
