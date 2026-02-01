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
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);

// Better Auth handler should be mounted BEFORE express.json()
// and at a stable path that matches your BETTER_AUTH_URL base.
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ success: true, message: "MediStore API is running" });
});

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);
export default app;