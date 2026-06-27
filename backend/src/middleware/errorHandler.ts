import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { logger } from "../utils/logger";

// This is the single place in the entire app where errors are handled.
// Any controller that throws (or passes an error to next()) lands here.
// Express identifies it as an error handler because it has 4 parameters.

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Known, intentional errors (e.g. "Email already exists")
  if (err instanceof ApiError && err.isOperational) {
    return res
      .status(err.statusCode)
      .json(ApiResponse.error(err.message));
  }

  // Prisma unique constraint violation (e.g. duplicate email)
  if ((err as any).code === "P2002") {
    return res
      .status(409)
      .json(ApiResponse.error("A record with this value already exists."));
  }

  // Prisma record not found
  if ((err as any).code === "P2025") {
    return res
      .status(404)
      .json(ApiResponse.error("Record not found."));
  }

  // Unknown / unexpected errors — log full details, hide from client
  logger.error(`Unhandled error on ${req.method} ${req.path}`, err);

  return res.status(500).json(
    ApiResponse.error(
      process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again later."
        : err.message
    )
  );
};