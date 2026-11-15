import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: "احراز هویت انجام نشده است." },
      { status: 401 }
    );
  }

  const session = await verifyAdminToken(token);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "نشست کاری منقضی یا نامعتبر است." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: session,
  });
}
