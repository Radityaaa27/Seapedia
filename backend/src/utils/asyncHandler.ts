import { Request, Response, NextFunction, RequestHandler } from "express";

// Without this wrapper, every async controller needs its own try/catch.
// With it, any thrown error (including ApiError) is forwarded
// automatically to our global errorHandler middleware.
//
// Usage:
//   router.get("/example", asyncHandler(async (req, res) => {
//     const data = await someService();  // if this throws, it's caught!
//     res.json(ApiResponse.success("OK", data));
//   }));

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};