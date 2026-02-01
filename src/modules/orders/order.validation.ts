import { z } from "zod";

export const OrderValidation = {
  create: z.object({
    body: z.object({
      shippingName: z.string().min(2),
      shippingPhone: z.string().min(6),
      shippingAddress: z.string().min(2),
      shippingCity: z.string().min(2),
      shippingArea: z.string().optional(),
      notes: z.string().optional(),
      items: z.array(
        z.object({
          medicineId: z.string().min(5),
          quantity: z.coerce.number().int().min(1),
        })
      ).min(1),
    }),
  }),

  updateStatus: z.object({
    body: z.object({
      status: z.enum(["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
    }),
  }),
};
