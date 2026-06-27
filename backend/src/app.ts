import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

// Security middleware
app.use(helmet());

// Allow requests from the frontend (adjust origin in production)
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// Parse JSON request bodies
app.use(express.json());

// Log HTTP requests to the console
app.use(morgan("dev"));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "SEAPEDIA API is running 🚀" });
});

export default app;