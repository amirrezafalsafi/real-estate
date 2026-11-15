import { NextResponse } from "next/server";
import { USER_COOKIE_NAME } from "@/lib/user-auth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "با موفقیت از حساب کاربری خارج شدید.",
  });

  response.cookies.set(USER_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
