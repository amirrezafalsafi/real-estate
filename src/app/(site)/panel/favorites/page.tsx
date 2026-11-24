import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, Building2, Search, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";
import { formatNumber } from "@/lib/format";
import { FavoriteItemCard } from "@/components/site/FavoriteItemCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "املاک نشان‌شده | پنل کاربری",
  description: "لیست املاک ذخیره و نشان‌شده توسط شما",
};

export const instant = false;

export default async function UserFavoritesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
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

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>املاک نشان‌شده من</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            مجموعاً {formatNumber(favorites.length)} ملک در لیست علاقه‌مندی‌های شما ذخیره شده است.
          </p>
        </div>

        <Link href="/properties">
          <Button variant="outline" size="sm" rightIcon={<Search className="h-4 w-4" />}>
            جستجوی املاک جدید
          </Button>
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Bookmark className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              هنوز ملکی را نشان نکرده‌اید
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              هنگام مرور املاک با کلیک روی آیکون نشان کردن، فایل‌های مورد علاقه خود را برای دسترسی سریع ذخیره کنید.
            </p>
          </div>
          <Link href="/properties">
            <Button variant="primary" size="md">
              مشاهده لیست املاک
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav) => (
            <FavoriteItemCard
              key={fav.id}
              favoriteId={fav.id}
              property={fav.property}
            />
          ))}
        </div>
      )}
    </div>
  );
}
