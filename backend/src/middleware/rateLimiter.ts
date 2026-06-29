import rateLimit from "express-rate-limit";
import { ApiResponse } from "../utils/ApiResponse";

export const generalLimiter =  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders:false, 
    handler: (_req,res) => {
        res.status(429).json(
            ApiResponse.error(
                "Too many request. Please wait a moment before trying again."
            )
        );
    },
});
export const authLimiter =  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders:false, 
    handler: (_req,res) => {
        res.status(429).json(
            ApiResponse.error(
                "Too many login attempts. Please wait a moment before trying again."
            )
        );
    },
});

export const topUpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    handler: (_req,res) => {
        res.status(429).json(
            ApiResponse.error("Too many top-up requests. Please wait an hour")
        );
    },
});