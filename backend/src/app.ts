import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { sanitizeInput } from "./middleware/sanitize";
import { generalLimiter, authLimiter, topUpLimiter } from "./middleware/rateLimiter";
import routes from "./routes";

const app = express();

// ── Security Headers ───────────────────────────────────────
// Helmet sets secure HTTP headers automatically:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - X-XSS-Protection: 1; mode=block
// - Strict-Transport-Security (HSTS)
// - Content-Security-Policy
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // Allow embedding in development
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// ── CORS ───────────────────────────────────────────────────
// Only allow requests from the frontend URL
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body Parsing ───────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Logging ────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ── Input Sanitization ─────────────────────────────────────
// Strip XSS from all request bodies
app.use(sanitizeInput);

// ── Rate Limiting ──────────────────────────────────────────
app.use("/api", generalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/wallet/topup", topUpLimiter);

// ── Routes ─────────────────────────────────────────────────
app.use("/api", routes);

// ── Health Check ───────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "SEAPEDIA API is running 🚀",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── Error Handling ─────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;