import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET_STRING =
  process.env.ADMIN_JWT_SECRET ||
  "sarpanah-super-secret-jwt-key-2026-production-ready-key";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const JWT_LEGACY_SECRET = new TextEncoder().encode(
  "maskan-plus-super-secret-jwt-key-2026-production-ready-key"
);

export const ADMIN_COOKIE_NAME = "admin_session";

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export interface AdminSessionData {
  id: string;
  email: string;
  name: string;
}

export async function signAdminToken(payload: AdminSessionData): Promise<string> {
  return new SignJWT({
    id: payload.id,
    email: payload.email,
    name: payload.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminSessionData | null> {
  try {
    let payload;
    try {
      const res = await jwtVerify(token, JWT_SECRET);
      payload = res.payload;
    } catch {
      const res = await jwtVerify(token, JWT_LEGACY_SECRET);
      payload = res.payload;
    }
    if (!payload.id || !payload.email) {
      return null;
    }
    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name || "مدیر سیستم"),
    };
  } catch {
    return null;
  }
}
