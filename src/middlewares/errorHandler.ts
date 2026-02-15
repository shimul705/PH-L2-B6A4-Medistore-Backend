import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Prisma } from "../generated/prisma/client";


export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Prisma "record not found" (P2025) can happen during sign-out if the session
  // was already deleted/expired. Make sign-out idempotent so it never crashes
  // your API in production.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025" && (err as any)?.meta?.modelName === "Session") {
      return res.status(200).json({
        success: true,
        message: "Already signed out",
        data: null,
      });
    }
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err?.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
