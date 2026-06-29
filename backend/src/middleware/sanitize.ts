import { Request, Response, NextFunction } from "express";
import xss from "xss";
import { array } from "zod";

const sanitizeValue = (value: unknown): unknown => {
    if(typeof value === "string"){
        return xss(value.trim());
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (value !== null && typeof value === "object") {
        return sanitizeObject(value as Record<string, unknown>);
    }
    return value;
};

const sanitizeObject = (
    obj: Record<string, unknown>
): Record<string,unknown> =>{
    const sanitized: Record<string,unknown> = {};
    for (const key of Object.keys(obj)) {
        sanitized[key] = sanitizeValue(obj[key]);
    }
    return sanitized;
};
export const sanitizedInput = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (req.body && typeof req.body === "object") {
        req.body = sanitizeObject(req.body);
    }
    next();
};