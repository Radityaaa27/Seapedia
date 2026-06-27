import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

const app = express();

// Security middleware
app.use(helmet());

// Allow requests from the frontend
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// Parse JSON request bodies
app.use(express.json());

// Log HTTP requests in development
app.use(morgan("dev"));

// ── Routes ────────────────────────────────────────────────────
// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "SEAPEDIA API is running 🚀" });
});

// Future routes will be mounted here, e.g.:
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);

// ── Error Handling ─────────────────────────────────────────────
// notFound must come after all routes
app.use(notFound);

// errorHandler must be the very last middleware (4 params)
app.use(errorHandler);

export default app;