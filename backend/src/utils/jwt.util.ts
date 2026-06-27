import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError";

// Shape of the data encoded inside every JWT token
export interface JwtPayload {
  userId: string;
  email: string;
  activeRole: string;
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

// Called at login — creates the token the frontend stores
export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
};

// Called on every protected request — decodes and validates the token
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, getSecret()) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized("Token has expired. Please log in again.");
    }
    throw ApiError.unauthorized("Invalid token. Please log in again.");
  }
};