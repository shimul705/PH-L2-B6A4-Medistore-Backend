import { z } from "zod";

export const AuthValidation = {
  register: z.object({
    body: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      role: z.enum(["CUSTOMER", "SELLER"]).optional(),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }),
  }),
};
