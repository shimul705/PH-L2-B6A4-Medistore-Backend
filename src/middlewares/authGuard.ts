import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { ApiError } from "../utils/ApiError";

export type AppUser = {
  id: string;
  email: string;
  name?: string | null;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  isBanned: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: AppUser;
    }
  }
}

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const u: any = session.user;
  if (u.isBanned) throw new ApiError(403, "Your account is banned");

  req.user = {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    isBanned: u.isBanned,
  };

  next();
};

export const requireRole =
  (...roles: AppUser["role"][]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    if (!roles.includes(req.user.role)) throw new ApiError(403, "Forbidden");
    next();
  };
