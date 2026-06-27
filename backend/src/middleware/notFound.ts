import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";

// Catches any request that didn't match a route.
// Must be registered AFTER all routes in app.ts.

export const notFound = (req: Request, res: Response) => {
  res.status(404).json(
    ApiResponse.error(`Route ${req.method} ${req.originalUrl} not found.`)
  );
};