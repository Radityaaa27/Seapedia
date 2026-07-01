import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";

// Same as authenticate, but never blocks the request.
// If a valid token is present, req.user is attached.
// If not (or it's invalid), the request continues as a guest.
export const optionalAuthenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = verifyToken(token);
      (req as any).user = decoded;
    } catch {
      // invalid/expired token — just treat as guest, don't throw
    }
  }

  next();
};