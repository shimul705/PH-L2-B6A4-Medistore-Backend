import express from "express";
import cors from "cors";
import routes from "./routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(
  cors({
    // Configure CORS to allow both production and Vercel preview deployments
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.APP_URL || "http://localhost:3000",
        process.env.PROD_APP_URL, // Production frontend URL
      ].filter(Boolean) as string[];

      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Better Auth handler should be mounted BEFORE express.json()
// and at a stable path that matches your BETTER_AUTH_URL base.
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ success: true, message: "MediStore API is running" });
});

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);
export default app;