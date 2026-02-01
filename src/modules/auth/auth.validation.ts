import { z } from "zod";

export const AuthValidation = {
  register: z.object({
    body: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      // Assignment: user chooses role at registration (except ADMIN which is seeded)
      role: z.enum(["CUSTOMER", "SELLER"]),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }),
  }),
};
