import { z } from "zod";

export const CategoryValidation = {
  create: z.object({
    body: z.object({
      name: z.string().min(2),
    }),
  }),

  update: z.object({
    body: z.object({
      name: z.string().min(2).optional(),
    }),
  }),
};
