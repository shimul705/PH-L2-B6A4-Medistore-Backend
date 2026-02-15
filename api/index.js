var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";

// src/routes/index.ts
import { Router as Router10 } from "express";

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/modules/auth/auth.controller.ts
import { fromNodeHeaders } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum OrderStatus {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\n// ---------------------------\n// Better Auth core models\n// ---------------------------\n\nmodel User {\n  id            String  @id @default(cuid())\n  email         String  @unique\n  name          String\n  image         String?\n  emailVerified Boolean @default(false)\n\n  role     Role    @default(CUSTOMER)\n  isBanned Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  sessions Session[]\n  accounts Account[]\n\n  // Domain relations\n  medicines Medicine[] @relation("SellerMedicines")\n  orders    Order[]    @relation("CustomerOrders")\n  reviews   Review[]\n  addresses Address[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id @default(cuid())\n  expiresAt DateTime\n  token     String   @unique\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  ipAddress String?\n  userAgent String?\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id         String @id @default(cuid())\n  accountId  String\n  providerId String\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // Tokens for OAuth providers\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n\n  // Email+password auth stores a hashed password here\n  password String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([providerId, accountId])\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id @default(cuid())\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\n// ---------------------------\n// Domain models\n// ---------------------------\n\nmodel Category {\n  id        String   @id @default(cuid())\n  name      String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  medicines Medicine[]\n}\n\nmodel Medicine {\n  id           String  @id @default(cuid())\n  name         String\n  description  String\n  price        Decimal\n  stock        Int     @default(0)\n  manufacturer String\n  imageUrl     String?\n  isActive     Boolean @default(true)\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  sellerId String\n  seller   User   @relation("SellerMedicines", fields: [sellerId], references: [id])\n\n  reviews   Review[]\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([categoryId])\n  @@index([sellerId])\n  @@index([price])\n  @@index([manufacturer])\n}\n\nmodel Order {\n  id              String      @id @default(cuid())\n  status          OrderStatus @default(PLACED)\n  shippingName    String\n  shippingPhone   String\n  shippingAddress String\n  shippingCity    String\n  shippingArea    String?\n  notes           String?\n\n  total Decimal\n\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id])\n\n  items Json\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([customerId])\n  @@index([status])\n}\n\nmodel Review {\n  id        String   @id @default(cuid())\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now())\n\n  customerId String\n  customer   User   @relation(fields: [customerId], references: [id])\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n\n  @@unique([customerId, medicineId])\n  @@index([medicineId])\n}\n\nmodel Address {\n  id        String  @id @default(cuid())\n  type      String  @default("Home")\n  fullName  String\n  phone     String\n  address   String\n  city      String\n  state     String\n  zip       String\n  isDefault Boolean @default(false)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("address")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"SellerMedicines"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":null},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"SellerMedicines"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"shippingName","kind":"scalar","type":"String"},{"name":"shippingPhone","kind":"scalar","type":"String"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"shippingCity","kind":"scalar","type":"String"},{"name":"shippingArea","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"items","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"}],"dbName":null},"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"zip","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"address"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AddressScalarFieldEnum: () => AddressScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  JsonNullValueInput: () => JsonNullValueInput,
  MedicineScalarFieldEnum: () => MedicineScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Category: "Category",
  Medicine: "Medicine",
  Order: "Order",
  Review: "Review",
  Address: "Address"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  email: "email",
  name: "name",
  image: "image",
  emailVerified: "emailVerified",
  role: "role",
  isBanned: "isBanned",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MedicineScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  stock: "stock",
  manufacturer: "manufacturer",
  imageUrl: "imageUrl",
  isActive: "isActive",
  categoryId: "categoryId",
  sellerId: "sellerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  status: "status",
  shippingName: "shippingName",
  shippingPhone: "shippingPhone",
  shippingAddress: "shippingAddress",
  shippingCity: "shippingCity",
  shippingArea: "shippingArea",
  notes: "notes",
  total: "total",
  customerId: "customerId",
  items: "items",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  customerId: "customerId",
  medicineId: "medicineId"
};
var AddressScalarFieldEnum = {
  id: "id",
  type: "type",
  fullName: "fullName",
  phone: "phone",
  address: "address",
  city: "city",
  state: "state",
  zip: "zip",
  isDefault: "isDefault",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var JsonNullValueInput = {
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/mailer.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
    // Gmail App Password (recommended)
  }
});
var sendEmail = async (opts) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: opts.to,
    subject: opts.subject,
    html: opts.html
  });
};

// src/lib/auth.ts
var normalizeRole = (role) => {
  const value = String(role ?? "").toUpperCase();
  if (value === "SELLER") return "SELLER";
  if (value === "ADMIN") return "ADMIN";
  return "CUSTOMER";
};
var auth = betterAuth({
  // IMPORTANT: baseURL should be your server origin (not including /api/auth)
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  secret: process.env.BETTER_AUTH_SECRET || "CHANGE_ME",
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `<p>Click to verify your email:</p><p><a href="${url}">${url}</a></p>`
      });
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
    // ✅ only affects email/password sign-in :contentReference[oaicite:2]{index=2}
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: true
      },
      isBanned: {
        type: "boolean",
        required: false,
        input: false,
        default: false
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
          const incomingEmail = String(user.email || "").toLowerCase();
          const desiredRole = normalizeRole(user.role);
          const role = adminEmail && incomingEmail === adminEmail ? "ADMIN" : desiredRole === "SELLER" ? "SELLER" : "CUSTOMER";
          return {
            data: {
              ...user,
              role,
              isBanned: false
            }
          };
        }
      }
    }
  }
});

// src/middlewares/asyncHandler.ts
var asyncHandler = (
  // Allow controllers to `return res.json(...)` without fighting the type system.
  // Express ignores returned values; only thrown errors matter.
  (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  }
);

// src/utils/ApiError.ts
var ApiError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
};

// src/modules/auth/auth.controller.ts
var AuthController = {
  register: asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const data = await auth.api.signUpEmail({
      body: {
        // `role` is required by our Better Auth additionalFields config.
        // Validation should ensure it exists and is one of the allowed roles.
        name,
        email,
        password,
        role
      },
      // Return a Response so cookies/headers (if any) are preserved
      asResponse: true
    });
    const text = await data.text();
    res.status(data.status);
    data.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(text ? JSON.parse(text) : null);
  }),
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const u = await prisma.user.findUnique({ where: { email } });
    if (u?.isBanned) throw new ApiError(403, "Your account is banned");
    const user = await prisma.user.findUnique({ where: { email } });
    if (user?.isBanned) throw new ApiError(403, "Your account is banned");
    const response = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true
    });
    const text = await response.text();
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(text ? JSON.parse(text) : null);
  }),
  logout: asyncHandler(async (req, res) => {
    const response = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
      asResponse: true
    });
    const text = await response.text();
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(text ? JSON.parse(text) : null);
  }),
  google: asyncHandler(async (req, res) => {
    const callbackURL = typeof req.query.callbackURL === "string" ? req.query.callbackURL : void 0;
    const response = await auth.api.signInSocial({
      body: {
        provider: "google",
        ...callbackURL ? { callbackURL } : {}
      },
      asResponse: true
    });
    const text = await response.text();
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(text ? JSON.parse(text) : null);
  }),
  me: asyncHandler(async (req, res) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    res.json({ success: true, data: session });
  })
};

// src/middlewares/validateRequest.ts
var validateRequest = (schema) => (req, _res, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues.map((i) => i.message).join(", ")
    );
  }
  next();
};

// src/modules/auth/auth.validation.ts
import { z } from "zod";
var AuthValidation = {
  register: z.object({
    body: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      // Assignment: user chooses role at registration (except ADMIN which is seeded)
      role: z.enum(["CUSTOMER", "SELLER"])
    })
  }),
  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8)
    })
  })
};

// src/modules/auth/auth.route.ts
var router = Router();
router.post("/register", validateRequest(AuthValidation.register), AuthController.register);
router.post("/login", validateRequest(AuthValidation.login), AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", AuthController.me);
router.get("/google", AuthController.google);
var auth_route_default = router;

// src/modules/categories/category.route.ts
import { Router as Router2 } from "express";

// src/modules/categories/category.service.ts
var CategoryService = {
  getAll: () => prisma.category.findMany({ orderBy: { createdAt: "desc" } }),
  create: (payload) => prisma.category.create({ data: payload }),
  update: async (id, payload) => {
    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) throw new ApiError(404, "Category not found");
    return prisma.category.update({ where: { id }, data: payload });
  },
  remove: async (id) => {
    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) throw new ApiError(404, "Category not found");
    await prisma.category.delete({ where: { id } });
  }
};

// src/modules/categories/category.controller.ts
var CategoryController = {
  getAll: asyncHandler(async (_req, res) => {
    const data = await CategoryService.getAll();
    res.json({ success: true, data });
  }),
  create: asyncHandler(async (req, res) => {
    const data = await CategoryService.create(req.body);
    res.status(201).json({ success: true, data });
  }),
  update: asyncHandler(async (req, res) => {
    const data = await CategoryService.update(req.params.id, req.body);
    res.json({ success: true, data });
  }),
  remove: asyncHandler(async (req, res) => {
    await CategoryService.remove(req.params.id);
    res.status(204).send();
  })
};

// src/middlewares/authGuard.ts
import { fromNodeHeaders as fromNodeHeaders2 } from "better-auth/node";
var requireAuth = async (req, _res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders2(req.headers)
  });
  if (!session?.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const u = session.user;
  if (u.isBanned) throw new ApiError(403, "Your account is banned");
  req.user = {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    isBanned: u.isBanned
  };
  next();
};
var requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  if (!roles.includes(req.user.role)) throw new ApiError(403, "Forbidden");
  next();
};

// src/modules/categories/category.validation.ts
import { z as z2 } from "zod";
var CategoryValidation = {
  create: z2.object({
    body: z2.object({
      name: z2.string().min(2)
    })
  }),
  update: z2.object({
    body: z2.object({
      name: z2.string().min(2).optional()
    })
  })
};

// src/modules/categories/category.route.ts
var router2 = Router2();
router2.get("/", CategoryController.getAll);
router2.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(CategoryValidation.create),
  CategoryController.create
);
router2.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateRequest(CategoryValidation.update),
  CategoryController.update
);
router2.delete("/:id", requireAuth, requireRole("ADMIN"), CategoryController.remove);
var category_route_default = router2;

// src/modules/medicines/medicine.route.ts
import { Router as Router3 } from "express";

// src/modules/medicines/medicine.service.ts
var MedicineService = {
  getMine: async (user) => {
    const where = user.role === "SELLER" ? { sellerId: user.id } : {};
    return prisma.medicine.findMany({
      where,
      include: { category: true, seller: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });
  },
  getAll: async (query) => {
    const search = query.search ? String(query.search) : void 0;
    const categoryId = query.categoryId ? String(query.categoryId) : void 0;
    const manufacturer = query.manufacturer ? String(query.manufacturer) : void 0;
    const minPrice = query.minPrice ? Number(query.minPrice) : void 0;
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : void 0;
    const priceFilter = {};
    if (minPrice !== void 0) priceFilter.gte = minPrice;
    if (maxPrice !== void 0) priceFilter.lte = maxPrice;
    return prisma.medicine.findMany({
      where: {
        isActive: true,
        ...search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
          ]
        } : {},
        ...categoryId ? { categoryId } : {},
        ...manufacturer ? { manufacturer: { contains: manufacturer, mode: "insensitive" } } : {},
        ...Object.keys(priceFilter).length ? { price: priceFilter } : {}
      },
      include: { category: true, seller: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });
  },
  getById: async (id) => {
    const medicine = await prisma.medicine.findUnique({
      where: { id },
      include: { category: true, seller: { select: { id: true, name: true, email: true } }, reviews: true }
    });
    if (!medicine) throw new ApiError(404, "Medicine not found");
    if (!medicine.isActive) throw new ApiError(404, "Medicine not found");
    return medicine;
  },
  create: async (user, payload) => {
    const sellerId = user.role === "ADMIN" ? payload.sellerId : user.id;
    if (!sellerId) throw new ApiError(400, "sellerId is required");
    return prisma.medicine.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: new prismaNamespace_exports.Decimal(payload.price),
        stock: payload.stock,
        manufacturer: payload.manufacturer,
        imageUrl: payload.imageUrl,
        categoryId: payload.categoryId,
        sellerId
      }
    });
  },
  update: async (user, id, payload) => {
    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if (!medicine) throw new ApiError(404, "Medicine not found");
    if (user.role === "SELLER" && medicine.sellerId !== user.id) {
      throw new ApiError(403, "Forbidden");
    }
    return prisma.medicine.update({
      where: { id },
      data: {
        ...payload.name !== void 0 ? { name: payload.name } : {},
        ...payload.description !== void 0 ? { description: payload.description } : {},
        ...payload.price !== void 0 ? { price: new prismaNamespace_exports.Decimal(payload.price) } : {},
        ...payload.stock !== void 0 ? { stock: payload.stock } : {},
        ...payload.manufacturer !== void 0 ? { manufacturer: payload.manufacturer } : {},
        ...payload.imageUrl !== void 0 ? { imageUrl: payload.imageUrl } : {},
        ...payload.categoryId !== void 0 ? { categoryId: payload.categoryId } : {},
        ...payload.isActive !== void 0 ? { isActive: payload.isActive } : {}
      }
    });
  },
  remove: async (user, id) => {
    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if (!medicine) throw new ApiError(404, "Medicine not found");
    if (user.role === "SELLER" && medicine.sellerId !== user.id) {
      throw new ApiError(403, "Forbidden");
    }
    await prisma.medicine.delete({ where: { id } });
  }
};

// src/modules/medicines/medicine.controller.ts
var MedicineController = {
  getAll: asyncHandler(async (req, res) => {
    const data = await MedicineService.getAll(req.query);
    res.json({ success: true, data });
  }),
  getMine: asyncHandler(async (req, res) => {
    const data = await MedicineService.getMine(req.user);
    res.json({ success: true, data });
  }),
  getById: asyncHandler(async (req, res) => {
    const data = await MedicineService.getById(req.params.id);
    res.json({ success: true, data });
  }),
  create: asyncHandler(async (req, res) => {
    const data = await MedicineService.create(req.user, req.body);
    res.status(201).json({ success: true, data });
  }),
  update: asyncHandler(async (req, res) => {
    const data = await MedicineService.update(req.user, req.params.id, req.body);
    res.json({ success: true, data });
  }),
  remove: asyncHandler(async (req, res) => {
    await MedicineService.remove(req.user, req.params.id);
    res.status(204).send();
  })
};

// src/modules/medicines/medicine.validation.ts
import { z as z3 } from "zod";
var MedicineValidation = {
  create: z3.object({
    body: z3.object({
      name: z3.string().min(2),
      description: z3.string().min(2),
      price: z3.coerce.number().min(0.01),
      stock: z3.coerce.number().int().min(0).default(0),
      manufacturer: z3.string().min(2),
      imageUrl: z3.string().url().optional(),
      categoryId: z3.string().min(5)
    })
  }),
  update: z3.object({
    body: z3.object({
      name: z3.string().min(2).optional(),
      description: z3.string().min(2).optional(),
      price: z3.coerce.number().min(0.01).optional(),
      stock: z3.coerce.number().int().min(0).optional(),
      manufacturer: z3.string().min(2).optional(),
      imageUrl: z3.string().url().optional(),
      categoryId: z3.string().min(5).optional(),
      isActive: z3.boolean().optional()
    })
  })
};

// src/modules/medicines/medicine.route.ts
var router3 = Router3();
router3.get("/", MedicineController.getAll);
router3.get("/mine", requireAuth, requireRole("SELLER", "ADMIN"), MedicineController.getMine);
router3.get("/:id", MedicineController.getById);
router3.post(
  "/",
  requireAuth,
  requireRole("SELLER", "ADMIN"),
  validateRequest(MedicineValidation.create),
  MedicineController.create
);
router3.put(
  "/:id",
  requireAuth,
  requireRole("SELLER", "ADMIN"),
  validateRequest(MedicineValidation.update),
  MedicineController.update
);
router3.delete("/:id", requireAuth, requireRole("SELLER", "ADMIN"), MedicineController.remove);
var medicine_route_default = router3;

// src/modules/orders/order.route.ts
import { Router as Router4 } from "express";

// src/modules/orders/order.service.ts
var OrderService = {
  create: async (user, payload) => {
    if (user.role !== "CUSTOMER") throw new ApiError(403, "Only customers can place orders");
    const items = payload.items;
    if (!Array.isArray(items) || items.length === 0) throw new ApiError(400, "Items are required");
    const medicineIds = items.map((i) => i.medicineId);
    return prisma.$transaction(async (tx) => {
      const medicines = await tx.medicine.findMany({
        where: { id: { in: medicineIds }, isActive: true },
        select: { id: true, name: true, price: true, stock: true, sellerId: true }
      });
      if (medicines.length !== medicineIds.length) {
        throw new ApiError(400, "One or more medicines are invalid");
      }
      let total = new prismaNamespace_exports.Decimal(0);
      for (const it of items) {
        const med = medicines.find((m) => m.id === it.medicineId);
        if (med.stock < it.quantity) throw new ApiError(400, `Not enough stock for ${med.name}`);
        total = total.add(med.price.mul(it.quantity));
      }
      const storedItems = items.map((it) => {
        const med = medicines.find((m) => m.id === it.medicineId);
        return {
          medicineId: med.id,
          sellerId: med.sellerId,
          quantity: it.quantity,
          unitPrice: med.price.toString()
        };
      });
      const order = await tx.order.create({
        data: {
          customerId: user.id,
          shippingName: payload.shippingName,
          shippingPhone: payload.shippingPhone,
          shippingAddress: payload.shippingAddress,
          shippingCity: payload.shippingCity,
          shippingArea: payload.shippingArea,
          notes: payload.notes,
          total,
          items: storedItems
        },
        include: { customer: true }
      });
      for (const it of items) {
        await tx.medicine.update({
          where: { id: it.medicineId },
          data: { stock: { decrement: it.quantity } }
        });
      }
      return order;
    });
  },
  getMyOrders: async (user) => {
    const args = {
      include: { customer: true },
      orderBy: { createdAt: "desc" }
    };
    if (user.role === "CUSTOMER") {
      args.where = { customerId: user.id };
    }
    const orders = await prisma.order.findMany(args);
    if (user.role === "SELLER") {
      return orders.filter((o) => {
        const items = o.items || [];
        return items.some((i) => i?.sellerId === user.id);
      });
    }
    return orders;
  },
  getById: async (user, id) => {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { customer: true }
    });
    if (!order) throw new ApiError(404, "Order not found");
    if (user.role === "CUSTOMER" && order.customerId !== user.id) throw new ApiError(403, "Forbidden");
    if (user.role === "SELLER") {
      const items = order.items || [];
      const owns = items.some((i) => i?.sellerId === user.id);
      if (!owns) throw new ApiError(403, "Forbidden");
    }
    return order;
  },
  updateStatus: async (user, id, status) => {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new ApiError(404, "Order not found");
    if (user.role === "CUSTOMER") throw new ApiError(403, "Customers cannot update order status");
    if (user.role === "SELLER") {
      const items = order.items || [];
      if (!items.some((i) => i?.sellerId === user.id)) throw new ApiError(403, "Forbidden");
    }
    if (order.status === "DELIVERED") throw new ApiError(400, "Delivered order cannot be updated");
    if (order.status === "CANCELLED") throw new ApiError(400, "Cancelled order cannot be updated");
    return prisma.order.update({
      where: { id },
      data: { status }
    });
  }
};

// src/modules/orders/order.controller.ts
var OrderController = {
  create: asyncHandler(async (req, res) => {
    const data = await OrderService.create(req.user, req.body);
    res.status(201).json({ success: true, data });
  }),
  getMy: asyncHandler(async (req, res) => {
    const data = await OrderService.getMyOrders(req.user);
    res.json({ success: true, data });
  }),
  getById: asyncHandler(async (req, res) => {
    const data = await OrderService.getById(req.user, req.params.id);
    res.json({ success: true, data });
  }),
  updateStatus: asyncHandler(async (req, res) => {
    const data = await OrderService.updateStatus(req.user, req.params.id, req.body.status);
    res.json({ success: true, data });
  })
};

// src/modules/orders/order.validation.ts
import { z as z4 } from "zod";
var OrderValidation = {
  create: z4.object({
    body: z4.object({
      shippingName: z4.string().min(2),
      shippingPhone: z4.string().min(6),
      shippingAddress: z4.string().min(2),
      shippingCity: z4.string().min(2),
      shippingArea: z4.string().optional(),
      notes: z4.string().optional(),
      items: z4.array(
        z4.object({
          medicineId: z4.string().min(5),
          quantity: z4.coerce.number().int().min(1)
        })
      ).min(1)
    })
  }),
  updateStatus: z4.object({
    body: z4.object({
      status: z4.enum(["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    })
  })
};

// src/modules/orders/order.route.ts
var router4 = Router4();
router4.post("/", requireAuth, requireRole("CUSTOMER"), validateRequest(OrderValidation.create), OrderController.create);
router4.get("/", requireAuth, OrderController.getMy);
router4.get("/:id", requireAuth, OrderController.getById);
router4.patch(
  "/:id",
  requireAuth,
  requireRole("SELLER", "ADMIN"),
  validateRequest(OrderValidation.updateStatus),
  OrderController.updateStatus
);
var order_route_default = router4;

// src/modules/reviews/review.route.ts
import { Router as Router5 } from "express";

// src/modules/reviews/review.service.ts
var ReviewService = {
  getForMedicine: async (medicineId) => {
    return prisma.review.findMany({
      where: { medicineId },
      include: { customer: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" }
    });
  },
  getFeed: async (limit = 10) => {
    return prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, name: true } },
        medicine: { select: { id: true, name: true, imageUrl: true } }
      }
    });
  },
  createFromOrder: async (user, orderId, payload) => {
    if (user.role !== "CUSTOMER") throw new ApiError(403, "Only customers can review");
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new ApiError(404, "Order not found");
    if (order.customerId !== user.id) throw new ApiError(403, "Not your order");
    if (order.status !== "DELIVERED" && order.status !== "CANCELLED") {
      throw new ApiError(400, "Order must be DELIVERED or CANCELLED to review");
    }
    const items = Array.isArray(order.items) ? order.items : [];
    if (items.length === 0) throw new ApiError(400, "Order has no items");
    const prefix = order.status === "DELIVERED" ? "I received my order, " : "My order is canceled, ";
    const comment = `${prefix}${String(payload.comment || "").trim()}`.trim();
    const created = [];
    for (const it of items) {
      const medicineId = it?.medicineId;
      if (!medicineId) continue;
      try {
        const r = await prisma.review.create({
          data: {
            rating: Number(payload.rating || 5),
            comment,
            customerId: user.id,
            medicineId
          }
        });
        created.push(r);
      } catch (e) {
      }
    }
    return created;
  },
  create: async (user, payload) => {
    if (user.role !== "CUSTOMER") throw new ApiError(403, "Only customers can review");
    const orders = await prisma.order.findMany({
      where: { customerId: user.id },
      select: { items: true }
    });
    const purchased = orders.some((o) => {
      const items = Array.isArray(o.items) ? o.items : [];
      return items.some((i) => i?.medicineId === payload.medicineId);
    });
    if (!purchased) throw new ApiError(400, "You can only review medicines you ordered");
    try {
      return await prisma.review.create({
        data: {
          rating: payload.rating,
          comment: payload.comment,
          customerId: user.id,
          medicineId: payload.medicineId
        }
      });
    } catch (e) {
      throw new ApiError(400, "You already reviewed this medicine");
    }
  }
};

// src/modules/reviews/review.controller.ts
var ReviewController = {
  getForMedicine: asyncHandler(async (req, res) => {
    const medicineId = String(req.query.medicineId || "");
    if (!medicineId) throw new ApiError(400, "medicineId query param is required");
    const data = await ReviewService.getForMedicine(medicineId);
    res.json({ success: true, data });
  }),
  getFeed: asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit || 10);
    const data = await ReviewService.getFeed(Number.isFinite(limit) ? limit : 10);
    res.json({ success: true, data });
  }),
  createFromOrder: asyncHandler(async (req, res) => {
    const orderId = String(req.params.orderId);
    const data = await ReviewService.createFromOrder(req.user, orderId, req.body);
    res.status(201).json({ success: true, data });
  }),
  create: asyncHandler(async (req, res) => {
    const data = await ReviewService.create(req.user, req.body);
    res.status(201).json({ success: true, data });
  })
};

// src/modules/reviews/review.validation.ts
import { z as z5 } from "zod";
var ReviewValidation = {
  create: z5.object({
    body: z5.object({
      medicineId: z5.string().min(5),
      rating: z5.coerce.number().int().min(1).max(5),
      comment: z5.string().optional()
    })
  }),
  createFromOrder: z5.object({
    params: z5.object({
      orderId: z5.string().min(5)
    }),
    body: z5.object({
      rating: z5.coerce.number().int().min(1).max(5).optional(),
      comment: z5.string().min(1)
    })
  })
};

// src/modules/reviews/review.route.ts
var router5 = Router5();
router5.get("/feed", ReviewController.getFeed);
router5.get("/", ReviewController.getForMedicine);
router5.post(
  "/order/:orderId",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(ReviewValidation.createFromOrder),
  ReviewController.createFromOrder
);
router5.post(
  "/",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(ReviewValidation.create),
  ReviewController.create
);
var review_route_default = router5;

// src/modules/seller/seller.route.ts
import { Router as Router6 } from "express";

// src/modules/seller/seller.controller.ts
var SellerController = {
  getOrders: asyncHandler(async (req, res) => {
    const data = await OrderService.getMyOrders(req.user);
    res.json({ success: true, data });
  }),
  updateOrderStatus: asyncHandler(async (req, res) => {
    const data = await OrderService.updateStatus(req.user, req.params.id, req.body.status);
    res.json({ success: true, data });
  })
};

// src/modules/seller/seller.route.ts
var router6 = Router6();
router6.use(requireAuth, requireRole("SELLER"));
router6.post("/medicines", validateRequest(MedicineValidation.create), MedicineController.create);
router6.put("/medicines/:id", validateRequest(MedicineValidation.update), MedicineController.update);
router6.delete("/medicines/:id", MedicineController.remove);
router6.get("/orders", SellerController.getOrders);
router6.patch("/orders/:id", validateRequest(OrderValidation.updateStatus), SellerController.updateOrderStatus);
var seller_route_default = router6;

// src/modules/admin/admin.route.ts
import { Router as Router7 } from "express";

// src/modules/admin/admin.service.ts
var AdminService = {
  getUsers: () => prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
  updateUserStatus: async (id, isBanned) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new ApiError(404, "User not found");
    return prisma.user.update({ where: { id }, data: { isBanned } });
  },
  getAllMedicines: () => prisma.medicine.findMany({ include: { category: true, seller: true }, orderBy: { createdAt: "desc" } }),
  getAllOrders: () => prisma.order.findMany({ include: { customer: true }, orderBy: { createdAt: "desc" } })
};

// src/modules/admin/admin.controller.ts
var AdminController = {
  getUsers: asyncHandler(async (_req, res) => {
    const data = await AdminService.getUsers();
    res.json({ success: true, data });
  }),
  updateUserStatus: asyncHandler(async (req, res) => {
    const data = await AdminService.updateUserStatus(req.params.id, req.body.isBanned);
    res.json({ success: true, data });
  }),
  getMedicines: asyncHandler(async (_req, res) => {
    const data = await AdminService.getAllMedicines();
    res.json({ success: true, data });
  }),
  getOrders: asyncHandler(async (_req, res) => {
    const data = await AdminService.getAllOrders();
    res.json({ success: true, data });
  })
};

// src/modules/admin/admin.validation.ts
import { z as z6 } from "zod";
var AdminValidation = {
  updateUserStatus: z6.object({
    body: z6.object({
      isBanned: z6.boolean()
    })
  })
};

// src/modules/admin/admin.route.ts
var router7 = Router7();
router7.use(requireAuth, requireRole("ADMIN"));
router7.get("/users", AdminController.getUsers);
router7.patch("/users/:id", validateRequest(AdminValidation.updateUserStatus), AdminController.updateUserStatus);
router7.get("/medicines", AdminController.getMedicines);
router7.get("/orders", AdminController.getOrders);
var admin_route_default = router7;

// src/modules/users/user.route.ts
import { Router as Router8 } from "express";

// src/modules/users/user.controller.ts
var UserController = {
  me: asyncHandler(async (req, res) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const u = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, image: true, role: true, isBanned: true, emailVerified: true }
    });
    if (!u) throw new ApiError(404, "User not found");
    res.json({ success: true, data: u });
  }),
  updateMe: asyncHandler(async (req, res) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const { name, image } = req.body || {};
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...name !== void 0 ? { name } : {},
        ...image !== void 0 ? { image } : {}
      },
      select: { id: true, email: true, name: true, image: true, role: true, isBanned: true, emailVerified: true }
    });
    res.json({ success: true, data: updated });
  })
};

// src/modules/users/user.validation.ts
import { z as z7 } from "zod";
var UserValidation = {
  updateMe: z7.object({
    body: z7.object({
      name: z7.string().min(1).max(100).optional(),
      image: z7.string().url().optional()
    })
  })
};

// src/modules/users/user.route.ts
var router8 = Router8();
router8.get("/me", requireAuth, UserController.me);
router8.patch("/me", requireAuth, validateRequest(UserValidation.updateMe), UserController.updateMe);
var user_route_default = router8;

// src/modules/addresses/address.route.ts
import { Router as Router9 } from "express";

// src/modules/addresses/address.service.ts
var AddressService = {
  listForUser: async (user) => {
    return prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }]
    });
  },
  getDefaultForUser: async (user) => {
    return prisma.address.findFirst({ where: { userId: user.id, isDefault: true } });
  },
  create: async (user, input) => {
    const count = await prisma.address.count({ where: { userId: user.id } });
    const shouldBeDefault = count === 0;
    return prisma.address.create({
      data: {
        type: input.type || "Home",
        fullName: input.fullName || input.name || "",
        phone: input.phone,
        address: input.address,
        city: input.city,
        state: input.state,
        zip: input.zip,
        userId: user.id,
        isDefault: shouldBeDefault
      }
    });
  },
  update: async (user, id, input) => {
    const found = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!found) throw new ApiError(404, "Address not found");
    const data = { ...input };
    if (data.name && !data.fullName) {
      data.fullName = data.name;
    }
    delete data.name;
    return prisma.address.update({ where: { id }, data });
  },
  remove: async (user, id) => {
    const found = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!found) throw new ApiError(404, "Address not found");
    const wasDefault = found.isDefault;
    await prisma.address.delete({ where: { id } });
    if (wasDefault) {
      const next = await prisma.address.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" }
      });
      if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
    return { success: true };
  },
  setDefault: async (user, id) => {
    const found = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!found) throw new ApiError(404, "Address not found");
    await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
      await tx.address.update({ where: { id }, data: { isDefault: true } });
    });
    return prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }]
    });
  }
};

// src/modules/addresses/address.controller.ts
var toClient = (a) => a ? { ...a, name: a.fullName } : a;
var AddressController = {
  list: asyncHandler(async (req, res) => {
    const data = await AddressService.listForUser(req.user);
    res.json({ success: true, data: (data || []).map(toClient) });
  }),
  getDefault: asyncHandler(async (req, res) => {
    const data = await AddressService.getDefaultForUser(req.user);
    res.json({ success: true, data: toClient(data) });
  }),
  create: asyncHandler(async (req, res) => {
    const data = await AddressService.create(req.user, req.body);
    res.status(201).json({ success: true, data: toClient(data) });
  }),
  update: asyncHandler(async (req, res) => {
    const data = await AddressService.update(req.user, String(req.params.id), req.body);
    res.json({ success: true, data: toClient(data) });
  }),
  remove: asyncHandler(async (req, res) => {
    const data = await AddressService.remove(req.user, String(req.params.id));
    res.json({ success: true, data });
  }),
  setDefault: asyncHandler(async (req, res) => {
    const data = await AddressService.setDefault(req.user, String(req.params.id));
    res.json({ success: true, data: (data || []).map(toClient) });
  })
};

// src/modules/addresses/address.validation.ts
import { z as z8 } from "zod";
var AddressValidation = {
  create: z8.object({
    body: z8.object({
      type: z8.string().min(1).optional(),
      // Frontend sends `name` but DB uses `fullName`. Accept either.
      fullName: z8.string().min(1).optional(),
      name: z8.string().min(1).optional(),
      // Phone must be digits only, 10-15 length.
      phone: z8.string().transform((v) => v.trim()).refine((v) => /^\d{10,15}$/.test(v), "Phone must be 10-15 digits"),
      address: z8.string().min(1),
      city: z8.string().min(1),
      state: z8.string().min(1),
      zip: z8.string().min(1)
    }).refine((b) => Boolean(b.fullName || b.name), { message: "Full name is required" })
  }),
  update: z8.object({
    params: z8.object({
      id: z8.string().min(5)
    }),
    body: z8.object({
      type: z8.string().min(1).optional(),
      fullName: z8.string().min(1).optional(),
      name: z8.string().min(1).optional(),
      phone: z8.string().transform((v) => v.trim()).refine((v) => /^\d{10,15}$/.test(v), "Phone must be 10-15 digits").optional(),
      address: z8.string().min(1).optional(),
      city: z8.string().min(1).optional(),
      state: z8.string().min(1).optional(),
      zip: z8.string().min(1).optional()
    })
  }),
  setDefault: z8.object({
    params: z8.object({
      id: z8.string().min(5)
    })
  })
};

// src/modules/addresses/address.route.ts
var router9 = Router9();
router9.get("/", requireAuth, requireRole("CUSTOMER"), AddressController.list);
router9.get("/default", requireAuth, requireRole("CUSTOMER"), AddressController.getDefault);
router9.post("/", requireAuth, requireRole("CUSTOMER"), validateRequest(AddressValidation.create), AddressController.create);
router9.patch(
  "/:id",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(AddressValidation.update),
  AddressController.update
);
router9.delete("/:id", requireAuth, requireRole("CUSTOMER"), AddressController.remove);
router9.post(
  "/:id/default",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(AddressValidation.setDefault),
  AddressController.setDefault
);
router9.patch(
  "/:id/default",
  requireAuth,
  requireRole("CUSTOMER"),
  validateRequest(AddressValidation.setDefault),
  AddressController.setDefault
);
var address_route_default = router9;

// src/routes/index.ts
var routes = Router10();
routes.use("/auth", auth_route_default);
routes.use("/categories", category_route_default);
routes.use("/medicines", medicine_route_default);
routes.use("/orders", order_route_default);
routes.use("/reviews", review_route_default);
routes.use("/seller", seller_route_default);
routes.use("/admin", admin_route_default);
routes.use("/users", user_route_default);
routes.use("/addresses", address_route_default);
var routes_default = routes;

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/middlewares/notFound.ts
var notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
};

// src/middlewares/errorHandler.ts
var errorHandler = (err, _req, res, _next) => {
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025" && err?.meta?.modelName === "Session") {
      return res.status(200).json({
        success: true,
        message: "Already signed out",
        data: null
      });
    }
  }
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err?.message || "Something went wrong";
  res.status(statusCode).json({
    success: false,
    message
  });
};

// src/app.ts
var app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.get("/", (_req, res) => {
  res.json({ success: true, message: "MediStore API is running" });
});
app.use("/api/v1", routes_default);
app.use(notFound);
app.use(errorHandler);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
