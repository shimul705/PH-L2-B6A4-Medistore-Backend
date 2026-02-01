import { z } from "zod";

export const AdminValidation = {
  updateUserStatus: z.object({
    body: z.object({
      isBanned: z.boolean(),
    }),
  }),
};
