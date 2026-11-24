import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const newStatus = body.status;

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json({ error: "ملک یافت نشد." }, { status: 404 });
    }

    if (property.userId !== user.id) {
      return NextResponse.json({ error: "شما اجازه تغییر وضعیت این ملک را ندارید." }, { status: 403 });
    }

    const validStatuses = ["ACTIVE", "SOLD", "RENTED", "HIDDEN"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: "وضعیت ارسالی نامعتبر است." }, { status: 400 });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({
      success: true,
      message: "وضعیت ملک با موفقیت به‌روزرسانی شد.",
      property: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطا در تغییر وضعیت ملک" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const { id } = await params;

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json({ error: "ملک یافت نشد." }, { status: 404 });
    }

    if (property.userId !== user.id) {
      return NextResponse.json({ error: "شما اجازه حذف این ملک را ندارید." }, { status: 403 });
    }

    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "آگهی ملک با موفقیت حذف شد.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطا در حذف ملک" },
      { status: 500 }
    );
  }
}
