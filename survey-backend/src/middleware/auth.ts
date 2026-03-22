import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const COOKIE_NAME = process.env.COOKIE_NAME || "admin_token";

export interface AdminJwtPayload {
  sub: string;
  role: "admin";
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: { email: string };
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AdminJwtPayload;
    if (!payload || payload.role !== "admin") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.admin = { email: payload.email };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}
