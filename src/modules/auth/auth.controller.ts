import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth";
import { asyncHandler } from "../../middlewares/asyncHandler";

export const AuthController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        ...(role ? { role } : {}),
      },
      // Return a Response so cookies/headers (if any) are preserved
      asResponse: true,
    });

    // Pipe the better-auth response to Express
    const text = await data.text();
    res.status(data.status);
    data.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(text ? JSON.parse(text) : null);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const response = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    const text = await response.text();
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(text ? JSON.parse(text) : null);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    res.json({ success: true, data: session });
  }),
};
