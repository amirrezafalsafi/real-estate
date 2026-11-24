import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const propertyId = request.nextUrl.searchParams.get("propertyId");

    if (propertyId) {
      if (!user) {
        return NextResponse.json({ success: true, isFavorite: false });
      }
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_propertyId: {
            userId: user.id,
            propertyId,
          },
        },
      });
      return NextResponse.json({ success: true, isFavorite: !!favorite });
    }

    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          include: {
            images: {
              take: 1,
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      favorites: favorites.map((fav) => ({
        id: fav.id,
        createdAt: fav.createdAt,
        property: fav.property,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطا در دریافت لیست نشان‌شده‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const body = await request.json();
    const propertyId = String(body.propertyId || "").trim();

    if (!propertyId) {
      return NextResponse.json({ error: "شناسه ملک الزامی است." }, { status: 400 });
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: user.id,
          propertyId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      return NextResponse.json({
        success: true,
        isFavorite: false,
        message: "ملک از لیست نشان‌شده‌ها حذف شد.",
      });
    }

    await prisma.favorite.create({
      data: {
        userId: user.id,
        propertyId,
      },
    });

    return NextResponse.json({
      success: true,
      isFavorite: true,
      message: "ملک به لیست نشان‌شده‌ها اضافه شد.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطا در تغییر وضعیت نشان کردن ملک" },
      { status: 500 }
    );
  }
}
