import { z } from "zod";

export const MedicineValidation = {
  create: z.object({
    body: z.object({
      name: z.string().min(2),
      description: z.string().min(2),
      price: z.coerce.number().min(0.01),
      stock: z.coerce.number().int().min(0).default(0),
      manufacturer: z.string().min(2),
      imageUrl: z.string().url().optional(),
      categoryId: z.string().min(5),
    }),
  }),

  update: z.object({
    body: z.object({
      name: z.string().min(2).optional(),
      description: z.string().min(2).optional(),
      price: z.coerce.number().min(0.01).optional(),
      stock: z.coerce.number().int().min(0).optional(),
      manufacturer: z.string().min(2).optional(),
      imageUrl: z.string().url().optional(),
      categoryId: z.string().min(5).optional(),
      isActive: z.boolean().optional(),
    }),
  }),
};
