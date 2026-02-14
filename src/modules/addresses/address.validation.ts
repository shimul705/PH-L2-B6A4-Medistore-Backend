import { z } from "zod";

export const AddressValidation = {
  create: z.object({
    body: z.object({
      type: z.string().min(1).optional(),
      // Frontend sends `name` but DB uses `fullName`. Accept either.
      fullName: z.string().min(1).optional(),
      name: z.string().min(1).optional(),
      // Phone must be digits only, 10-15 length.
      phone: z
        .string()
        .transform((v) => v.trim())
        .refine((v) => /^\d{10,15}$/.test(v), "Phone must be 10-15 digits"),
      address: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      zip: z.string().min(1),
    }).refine((b) => Boolean(b.fullName || b.name), { message: "Full name is required" }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().min(5),
    }),
    body: z.object({
      type: z.string().min(1).optional(),
      fullName: z.string().min(1).optional(),
      name: z.string().min(1).optional(),
      phone: z
        .string()
        .transform((v) => v.trim())
        .refine((v) => /^\d{10,15}$/.test(v), "Phone must be 10-15 digits")
        .optional(),
      address: z.string().min(1).optional(),
      city: z.string().min(1).optional(),
      state: z.string().min(1).optional(),
      zip: z.string().min(1).optional(),
    }),
  }),

  setDefault: z.object({
    params: z.object({
      id: z.string().min(5),
    }),
  }),
};
