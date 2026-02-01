import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";

const normalizeRole = (role: unknown): UserRole => {
  const value = String(role ?? "").toUpperCase();
  if (value === "SELLER") return "SELLER";
  if (value === "ADMIN") return "ADMIN";
  return "CUSTOMER";
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000/api/auth",
  secret: process.env.BETTER_AUTH_SECRET || "BG34KFxWOEkPAlmBqgBmAKVCUwilRTyt6",

  // Prisma 7: if you use custom Prisma client output, import PrismaClient from that output.
  // We already do that inside src/lib/prisma.ts.
  database: prismaAdapter(prisma as any, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: { type: "string", required: true, input: true },
      isBanned: { type: "boolean", required: false, input: false, default: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
          const incomingEmail = String((user as any).email || "").toLowerCase();

          const desiredRole = normalizeRole((user as any).role);

          // Only the seeded admin email can become ADMIN.
          const role: UserRole =
            adminEmail && incomingEmail === adminEmail ? "ADMIN" : desiredRole === "SELLER" ? "SELLER" : "CUSTOMER";

          return {
            data: {
              ...user,
              role,
              isBanned: false,
            },
          };
        },
      },
    },
  },
});
