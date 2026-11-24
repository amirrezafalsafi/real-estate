import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {
  signAdminToken,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
} from "@/lib/admin-auth";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rate-limit";
import { toPersianDigits } from "@/lib/format";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "لطفاً ایمیل و رمز عبور را وارد فرمایید." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const rateLimitKey = `${ip}_${normalizedEmail}`;

    const rateCheck = checkRateLimit(rateLimitKey);
    if (rateCheck.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          error: `تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفاً ${toPersianDigits(
            rateCheck.resetInMinutes
          )} دقیقه دیگر مجدداً تلاش فرمایید.`,
        },
        { status: 429 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      const failure = recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        {
          success: false,
          error:
            failure.remainingAttempts > 0
              ? `ایمیل یا رمز عبور نامعتبر است. (${toPersianDigits(
                  failure.remainingAttempts
                )} تلاش دیگر باقی‌مانده)`
              : "تعداد دفعات ورود ناموفق بیش از حد مجاز است. حساب کاربری موقتاً مسدود شد.",
        },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isValid) {
      const failure = recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        {
          success: false,
          error:
            failure.remainingAttempts > 0
              ? `ایمیل یا رمز عبور نامعتبر است. (${toPersianDigits(
                  failure.remainingAttempts
                )} تلاش دیگر باقی‌مانده)`
              : "تعداد دفعات ورود ناموفق بیش از حد مجاز است. لطفاً پس از ۱۵ دقیقه مجدداً تلاش فرمایید.",
        },
        { status: 401 }
      );
    }

    resetRateLimit(rateLimitKey);

    const token = await signAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد.",
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS);

    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, error: "خطای سیستمی در پردازش ورود. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
