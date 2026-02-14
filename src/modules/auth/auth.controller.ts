import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export const AuthController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const data = await auth.api.signUpEmail({
      body: {
        // `role` is required by our Better Auth additionalFields config.
        // Validation should ensure it exists and is one of the allowed roles.
        name,
        email,
        password,
        role,
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

    const u = await prisma.user.findUnique({ where: { email } });
    if (u?.isBanned) throw new ApiError(403, "Your account is banned");

    // Prevent banned users from creating a new session
    const user = await prisma.user.findUnique({ where: { email } });
    if (user?.isBanned) throw new ApiError(403, "Your account is banned");

    const response = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    const text = await response.text();
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(text ? JSON.parse(text) : null);
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    // End the current session (if any) and clear cookies
    const response = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    } as any);

    const text = await response.text();
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(text ? JSON.parse(text) : null);
  }),


  google: asyncHandler(async (req: Request, res: Response) => {
    // Starts Google OAuth flow.
    // If callbackURL isn't provided, Better Auth may fallback to the backend baseURL
    // which would send the user to http://localhost:4000 after consent.
    // We support callbackURL as a query param so the frontend can control where the
    // user lands after OAuth.
    const callbackURL = typeof req.query.callbackURL === "string" ? req.query.callbackURL : undefined;

    const response = await auth.api.signInSocial({
      body: {
        provider: "google",
        ...(callbackURL ? { callbackURL } : {}),
      },
      asResponse: true,
    } as any);

    const text = await response.text();
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    // Most of the time this will be a redirect response, so body may be empty.
    res.send(text ? JSON.parse(text) : null);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    res.json({ success: true, data: session });
  }),
};
