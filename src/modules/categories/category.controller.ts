import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { CategoryService } from "./category.service";

export const CategoryController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const data = await CategoryService.getAll();
    res.json({ success: true, data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await CategoryService.create(req.body);
    res.status(201).json({ success: true, data });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await CategoryService.update(req.params.id, req.body);
    res.json({ success: true, data });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await CategoryService.remove(req.params.id);
    res.status(204).send();
  }),
};
