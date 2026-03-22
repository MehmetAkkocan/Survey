import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_NAME = process.env.COOKIE_NAME || "admin_token";

function setAuthCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === "production";
  const secure =
    (process.env.COOKIE_SECURE || "").toLowerCase() === "true" || isProd;

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPwdHash = process.env.ADMIN_PASSWORD_BCRYPT;
  const adminPwdPlain = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }
  if (!adminEmail) {
    return res
      .status(500)
      .json({ success: false, message: "Admin email not configured" });
  }
  if (email !== adminEmail) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  let ok = false;
  if (adminPwdHash) {
    ok = await bcrypt.compare(password, adminPwdHash);
  } else if (adminPwdPlain) {
    ok = password === adminPwdPlain;
  } else {
    return res
      .status(500)
      .json({ success: false, message: "Admin password not configured" });
  }

  if (!ok) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { sub: "admin", role: "admin", email },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  setAuthCookie(res, token);

  return res.json({ success: true, user: { email } });
}

export async function me(req: Request, res: Response) {
  // requireAdmin middleware sets req.admin when valid
  if (req.admin?.email) {
    return res.json({ success: true, user: { email: req.admin.email } });
  }
  return res.status(401).json({ success: false, message: "Unauthorized" });
}

export async function logout(_req: Request, res: Response) {
  const isProd = process.env.NODE_ENV === "production";
  const secure =
    (process.env.COOKIE_SECURE || "").toLowerCase() === "true" || isProd;

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
  });
  return res.json({ success: true });
}
