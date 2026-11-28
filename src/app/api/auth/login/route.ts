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
        { error: "لطفاً شماره موبایل، ایمیل یا نام کاربری و رمز عبور را وارد فرمایید." },
        { status: 400 }
      );
    }

    const isEmail = rawIdentifier.includes("@");
    const cleanedPhone = normalizePhone(rawIdentifier);
    const isPotentialPhone = cleanedPhone.length >= 10 && cleanedPhone.startsWith("09");

    let user = null;

    if (isEmail) {
      user = await prisma.user.findUnique({
        where: { email: rawIdentifier.toLowerCase() },
      });
    } else if (isPotentialPhone) {
      user = await prisma.user.findUnique({
        where: { phone: cleanedPhone },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { name: rawIdentifier },
            { email: rawIdentifier.toLowerCase() },
            ...(cleanedPhone ? [{ phone: cleanedPhone }] : []),
          ],
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "شماره موبایل، ایمیل، نام کاربری یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "شماره موبایل، ایمیل، نام کاربری یا رمز عبور اشتباه است." },
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
