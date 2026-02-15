import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "./mailer";

type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";

const normalizeRole = (role: unknown): UserRole => {
  const value = String(role ?? "").toUpperCase();
  if (value === "SELLER") return "SELLER";
  if (value === "ADMIN") return "ADMIN";
  return "CUSTOMER";
};

export const auth = betterAuth({
  // IMPORTANT: baseURL should be your server origin (not including /api/auth)
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  secret: process.env.BETTER_AUTH_SECRET || "CHANGE_ME",

  database: prismaAdapter(prisma as any, {
    provider: "postgresql",
  }),

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {

      const verifyUrl = `${url}&callbackURL=${process.env.PROD_APP_URL}`;

      void sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `
        <p>Click to verify your email:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      `,
      });
    },
  },


  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // ✅ only affects email/password sign-in 
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: true,
      },
      isBanned: {
        type: "boolean",
        required: false,
        input: false,
        default: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
          const incomingEmail = String((user as any).email || "").toLowerCase();

          const desiredRole = normalizeRole((user as any).role);

          // Do not allow registering ADMIN unless it's the seeded admin email
          const role: UserRole =
            adminEmail && incomingEmail === adminEmail
              ? "ADMIN"
              : desiredRole === "SELLER"
                ? "SELLER"
                : "CUSTOMER";

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

  // Session/cookie settings for production (Vercel) compatibility
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  advanced: {
    cookiePrefix: "better-auth",

    useSecureCookies: process.env.NODE_ENV === "production",

    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },

    disableCSRFCheck: true,
  },



});
