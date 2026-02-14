import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { AddressService } from "./address.service";

const toClient = (a: any) => (a ? { ...a, name: a.fullName } : a);

export const AddressController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const data = await AddressService.listForUser(req.user!);
    res.json({ success: true, data: (data || []).map(toClient) });
  }),

  getDefault: asyncHandler(async (req: Request, res: Response) => {
    const data = await AddressService.getDefaultForUser(req.user!);
    res.json({ success: true, data: toClient(data) });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await AddressService.create(req.user!, req.body);
    res.status(201).json({ success: true, data: toClient(data) });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await AddressService.update(req.user!, String(req.params.id), req.body);
    res.json({ success: true, data: toClient(data) });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const data = await AddressService.remove(req.user!, String(req.params.id));
    res.json({ success: true, data });
  }),

  setDefault: asyncHandler(async (req: Request, res: Response) => {
    const data = await AddressService.setDefault(req.user!, String(req.params.id));
    res.json({ success: true, data: (data || []).map(toClient) });
  }),
};
