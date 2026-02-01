import type { NextFunction, Request, Response } from "express";

export const asyncHandler =
  // Allow controllers to `return res.json(...)` without fighting the type system.
  // Express ignores returned values; only thrown errors matter.
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
