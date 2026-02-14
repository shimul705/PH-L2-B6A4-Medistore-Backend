import { z } from "zod";

export const ReviewValidation = {
  create: z.object({
    body: z.object({
      medicineId: z.string().min(5),
      rating: z.coerce.number().int().min(1).max(5),
      comment: z.string().optional(),
    }),
  }),

  createFromOrder: z.object({
    params: z.object({
      orderId: z.string().min(5),
    }),
    body: z.object({
      rating: z.coerce.number().int().min(1).max(5).optional(),
      comment: z.string().min(1),
    }),
  }),
};
