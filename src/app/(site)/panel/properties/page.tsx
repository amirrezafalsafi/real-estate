import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { PropertyStatus } from "@prisma/client";
import {
  Building2,
  PlusCircle,
  MapPin,
  Maximize2,
  Bed,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";
import { formatNumber, formatPrice, toPersianDigits, formatJalaliDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { UserPropertyCardActions } from "@/components/site/UserPropertyCardActions";

export const metadata: Metadata = {
  title: "املاک و آگهی‌های من | پنل کاربری",
  description: "مدیریت، تغییر وضعیت و بررسی فایل‌های ملکی ثبت‌شده توسط شما",
};

export const instant = false;

interface UserPropertiesPageProps {
  searchParams?: Promise<{ status?: string }>;
}

export default async function UserPropertiesPage({ searchParams }: UserPropertiesPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const statusFilter = resolvedParams.status;

  const whereClause: { userId: string; status?: PropertyStatus } = { userId: user.id };
  if (statusFilter === "ACTIVE") {
    whereClause.status = "ACTIVE";
  } else if (statusFilter === "CLOSED") {
    whereClause.status = "SOLD";
  }

  const [properties, totalCount, activeCount, closedCount] = await Promise.all([
    prisma.property.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          take: 1,
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.property.count({ where: { userId: user.id } }),
    prisma.property.count({ where: { userId: user.id, status: "ACTIVE" } }),
    prisma.property.count({
      where: {
        userId: user.id,
        status: { in: ["SOLD", "RENTED"] },
      },
    }),
  ]);

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>املاک و آگهی‌های من</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            مجموعاً {formatNumber(totalCount)} ملک توسط شما در سامانه سرپناه ثبت شده است.
          </p>
        </div>

        <Link href="/submit-property">
          <Button variant="primary" size="sm" rightIcon={<PlusCircle className="h-4 w-4" />}>
            ثبت رایگان ملک جدید
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/panel/properties"
          className={`rounded-2xl border p-4 transition-all ${
            !statusFilter
              ? "border-blue-500/40 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs"
              : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-300">کل آگهی‌ها</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-xs">
              {formatNumber(totalCount)}
            </span>
          </div>
        </Link>

        <Link
          href="/panel/properties?status=ACTIVE"
          className={`rounded-2xl border p-4 transition-all ${
            statusFilter === "ACTIVE"
              ? "border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs"
              : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-300">آماده معامله (فعال)</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-xs">
              {formatNumber(activeCount)}
            </span>
          </div>
        </Link>

        <Link
          href="/panel/properties?status=CLOSED"
          className={`rounded-2xl border p-4 transition-all ${
            statusFilter === "CLOSED"
              ? "border-amber-500/40 bg-amber-50/70 dark:bg-amber-950/40 shadow-xs"
              : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-300">فروخته‌شده / واگذارشده</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600 text-white font-black text-xs">
              {formatNumber(closedCount)}
            </span>
          </div>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Building2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              {statusFilter ? "هیچ ملکی با این فیلتر یافت نشد" : "شما هنوز ملکی ثبت نکرده‌اید"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              با ثبت رایگان آگهی، ملک شما در صفحه اول و جستجوی تخصصی هزاران بازدیدکننده فعال قرار می‌گیرد.
            </p>
          </div>
          <Link href="/submit-property">
            <Button variant="primary" size="lg" rightIcon={<PlusCircle className="h-4 w-4" />}>
              ثبت رایگان اولین ملک
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4 flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={prop.images[0]?.url || "/images/properties/prop-1.webp"}
                    alt={prop.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <Badge variant={prop.listingType === "SALE" ? "sale" : "rent"} size="sm">
                      {prop.listingType === "SALE" ? "فروش" : "رهن و اجاره"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="rounded-lg bg-slate-950/70 backdrop-blur-xs text-white px-2 py-0.5 text-[10px] font-bold">
                      {formatJalaliDate(prop.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">
                      {prop.city}
                      {prop.district ? `، ${prop.district}` : ""}
                    </span>
                  </div>

                  <Link href={`/properties/${prop.slug}`}>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {prop.title}
                    </h3>
                  </Link>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>{toPersianDigits(prop.area)} متر</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="h-3.5 w-3.5 text-slate-400" />
                    <span>{prop.bedrooms === 0 ? "بدون خواب" : `${toPersianDigits(prop.bedrooms)} خواب`}</span>
                  </div>
                </div>

                <div>
                  {prop.listingType === "SALE" ? (
                    <p className="font-black text-blue-600 dark:text-blue-400 text-sm">
                      {formatPrice(prop.price)}
                    </p>
                  ) : (
                    <div className="space-y-0.5 text-xs">
                      <p className="text-slate-700 dark:text-slate-300">
                        <span className="text-slate-400">ودیعه: </span>
                        <span className="font-bold">{formatPrice(prop.deposit)}</span>
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <span className="text-slate-400">اجاره: </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{formatPrice(prop.monthlyRent)}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <UserPropertyCardActions
                propertyId={prop.id}
                slug={prop.slug}
                currentStatus={prop.status}
                listingType={prop.listingType}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
