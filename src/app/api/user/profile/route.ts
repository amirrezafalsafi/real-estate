import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getCurrentUser, signUserToken, USER_COOKIE_NAME, USER_COOKIE_OPTIONS } from "@/lib/user-auth";

export async function PUT(request: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد." }, { status: 400 });
    }

    const currentUserRecord = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!currentUserRecord) {
      return NextResponse.json({ error: "کاربر یافت نشد." }, { status: 404 });
    }

    if (email && email !== currentUserRecord.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "قالب ایمیل وارد شده نامعتبر است." }, { status: 400 });
      }

      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail && existingEmail.id !== session.id) {
        return NextResponse.json({ error: "این آدرس ایمیل قبلاً ثبت شده است." }, { status: 409 });
      }
    }

    let passwordHashToSave = currentUserRecord.passwordHash;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "جهت تغییر کلمه عبور، وارد کردن کلمه عبور فعلی الزامی است." },
          { status: 400 }
        );
      }

      const isValidPassword = await bcrypt.compare(currentPassword, currentUserRecord.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json({ error: "کلمه عبور فعلی اشتباه است." }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "کلمه عبور جدید باید حداقل ۶ کاراکتر باشد." },
          { status: 400 }
        );
      }

      passwordHashToSave = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        name,
        email: email || null,
        passwordHash: passwordHashToSave,
      },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    const token = await signUserToken(updatedUser);
    const response = NextResponse.json({
      success: true,
      message: "اطلاعات حساب کاربری با موفقیت ویرایش شد.",
      user: updatedUser,
    });

    response.cookies.set(USER_COOKIE_NAME, token, USER_COOKIE_OPTIONS);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطایی در ویرایش حساب کاربری رخ داد." },
      { status: 500 }
    );
  }
}
