import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export const UserController = {
  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const u = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, image: true, role: true, isBanned: true, emailVerified: true },
    });
    if (!u) throw new ApiError(404, "User not found");
    res.json({ success: true, data: u });
  }),

  updateMe: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const { name, image } = req.body || {};

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(image !== undefined ? { image } : {}),
      },
      select: { id: true, email: true, name: true, image: true, role: true, isBanned: true, emailVerified: true },
    });

    res.json({ success: true, data: updated });
  }),
};
