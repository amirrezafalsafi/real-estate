import type { Metadata } from "next";
import Link from "next/link";
import { Building2, PlusCircle, ExternalLink, Calendar, MapPin } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";
import { formatNumber, formatPrice, toPersianDigits } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "آگهی‌های من | پنل کاربری",
  description: "مدیریت فایل‌های ملکی ثبت‌شده توسط کاربر",
};

export default async function UserPropertiesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const properties = await prisma.property.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        take: 1,
        orderBy: { order: "asc" },
      },
    },
  });

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>املاک و آگهی‌های من</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            مجموعاً {formatNumber(properties.length)} ملک توسط شما ثبت شده است.
          </p>
        </div>

        <Link href="/submit-property">
          <Button variant="primary" size="sm" rightIcon={<PlusCircle className="h-4 w-4" />}>
            ثبت ملک جدید
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Building2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              شما هنوز ملکی ثبت نکرده‌اید
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              با ثبت رایگان آگهی ملک، فایل شما در معرض دید روزانه هزاران متقاضی خرید و اجاره قرار می‌گیرد.
            </p>
          </div>
          <Link href="/submit-property">
            <Button variant="primary" size="lg" rightIcon={<PlusCircle className="h-4 w-4" />}>
              ثبت رایگان اولین ملک
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src={prop.images[0]?.url || "/images/properties/prop-1.webp"}
                    alt={prop.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <Badge variant={prop.listingType === "SALE" ? "sale" : "rent"} size="sm">
                      {prop.listingType === "SALE" ? "فروش" : "رهن و اجاره"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    <span>{prop.city}{prop.district ? `، ${prop.district}` : ""}</span>
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm line-clamp-1">
                    {prop.title}
                  </h3>
                  <p className="text-xs font-black text-blue-600 dark:text-blue-400">
                    {prop.listingType === "SALE"
                      ? formatPrice(prop.price)
                      : formatPrice(prop.deposit, "تومان", { fallbackToNegotiable: true })}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  {toPersianDigits(new Date(prop.createdAt).toLocaleDateString("fa-IR"))}
                </span>

                <Link
                  href={`/properties/${prop.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>مشاهده آگهی</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
