"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/admin-auth";

async function ensureAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    throw new Error("دسترسی غیرمجاز: لطفاً ابتدا وارد حساب مدیریت شوید.");
  }

  const session = await verifyAdminToken(token);
  if (!session) {
    throw new Error("نشست کاری منقضی یا نامعتبر است.");
  }

  return session;
}

export async function toggleInquiryReadAction(id: string, isRead: boolean) {
  try {
    await ensureAdminSession();

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { isRead },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");

    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    console.error("toggleInquiryReadAction error:", error);
    const message = error instanceof Error ? error.message : "خطا در تغییر وضعیت درخواست.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function deleteInquiryAction(id: string) {
  try {
    await ensureAdminSession();

    await prisma.inquiry.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");

    return {
      success: true,
      message: "درخواست مشاوره با موفقیت حذف شد.",
    };
  } catch (error: unknown) {
    console.error("deleteInquiryAction error:", error);
    const message = error instanceof Error ? error.message : "خطا در حذف درخواست.";
    return {
      success: false,
      error: message,
    };
  }
}
