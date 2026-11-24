import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signUserToken, USER_COOKIE_NAME, USER_COOKIE_OPTIONS } from "@/lib/user-auth";

function normalizePhone(phone: string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let res = phone.trim();
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(persianDigits[i], String(i)).replaceAll(arabicDigits[i], String(i));
  }
  return res.replace(/\D/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawIdentifier = String(body.identifier || "").trim();
    const password = String(body.password || "");

    if (!rawIdentifier || !password) {
      return NextResponse.json(
        { error: "لطفاً شماره موبایل یا ایمیل و رمز عبور را وارد فرمایید." },
        { status: 400 }
      );
    }

    const isEmail = rawIdentifier.includes("@");
    const normalizedIdentifier = isEmail
      ? rawIdentifier.toLowerCase()
      : normalizePhone(rawIdentifier);

    const user = isEmail
      ? await prisma.user.findUnique({ where: { email: normalizedIdentifier } })
      : await prisma.user.findUnique({ where: { phone: normalizedIdentifier } });

    if (!user) {
      return NextResponse.json(
        { error: "شماره موبایل، ایمیل یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "شماره موبایل، ایمیل یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    const token = await signUserToken({
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });

    const response = NextResponse.json({
      success: true,
      message: "ورود موفقیت‌آمیز بود.",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar,
      },
    });

    response.cookies.set(USER_COOKIE_NAME, token, USER_COOKIE_OPTIONS);

    return response;
  } catch {
    return NextResponse.json(
      { error: "خطایی در ورود رخ داد. لطفاً مجدداً تلاش فرمایید." },
      { status: 500 }
    );
  }
}
