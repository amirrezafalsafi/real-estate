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
    const name = String(body.name || "").trim();
    const rawPhone = String(body.phone || "").trim();
    const email = body.email ? String(body.email).trim().toLowerCase() : null;
    const password = String(body.password || "");

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد." },
        { status: 400 }
      );
    }

    const phone = normalizePhone(rawPhone);
    if (!/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "شماره موبایل وارد شده معتبر نیست (مثال: 09123456789)." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "رمز عبور باید حداقل ۶ کاراکتر باشد." },
        { status: 400 }
      );
    }

    const existingPhone = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: "حساب کاربری با این شماره موبایل قبلاً ایجاد شده است. لطفاً وارد شوید." },
        { status: 409 }
      );
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "این آدرس ایمیل قبلاً ثبت شده است." },
          { status: 409 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        avatar: true,
      },
    });

    const token = await signUserToken({
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "ثبت‌نام با موفقیت انجام شد.",
        user,
      },
      { status: 201 }
    );

    response.cookies.set(USER_COOKIE_NAME, token, USER_COOKIE_OPTIONS);

    return response;
  } catch {
    return NextResponse.json(
      { error: "خطایی در ثبت‌نام رخ داد. لطفاً مجدداً تلاش فرمایید." },
      { status: 500 }
    );
  }
}
