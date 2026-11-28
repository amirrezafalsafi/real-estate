import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const USER_JWT_SECRET_STRING =
  process.env.USER_JWT_SECRET ||
  "sarpanah-user-secret-jwt-key-2026-production-ready-key";
const USER_JWT_SECRET = new TextEncoder().encode(USER_JWT_SECRET_STRING);

export const USER_COOKIE_NAME = "user_session";

export const USER_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export interface UserSessionData {
  id: string;
  phone: string;
  name: string;
  email?: string | null;
  avatar?: string | null;
}

export async function signUserToken(payload: UserSessionData): Promise<string> {
  return new SignJWT({
    id: payload.id,
    phone: payload.phone,
    name: payload.name,
    email: payload.email || null,
    avatar: payload.avatar || null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(USER_JWT_SECRET);
}

export async function verifyUserToken(token: string): Promise<UserSessionData | null> {
  try {
    const { payload } = await jwtVerify(token, USER_JWT_SECRET);
    if (!payload.id || !payload.phone) {
      return null;
    }
    return {
      id: String(payload.id),
      phone: String(payload.phone),
      name: String(payload.name || "کاربر گرامی"),
      email: payload.email ? String(payload.email) : null,
      avatar: payload.avatar ? String(payload.avatar) : null,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_COOKIE_NAME)?.value;
    if (!token) {
      return null;
    }
    return await verifyUserToken(token);
  } catch {
    return null;
  }
}
