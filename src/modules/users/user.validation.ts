import { z } from "zod";

export const UserValidation = {
  updateMe: z.object({
    body: z.object({
      name: z.string().min(1).max(100).optional(),
      image: z.string().url().optional(),
    }),
  }),
};
