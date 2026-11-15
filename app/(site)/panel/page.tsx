import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Mail,
  ShieldCheck,
  PlusCircle,
  Search,
  Scale,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";
import { formatNumber, formatPrice, toPersianDigits } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "پیشخوان کاربری | مسکن پلاس",
  description: "مدیریت املاک ثبت‌شده، درخواست‌های مشاوره و اطلاعات حساب کاربری",
};

export default async function UserPanelPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const [propertiesCount, inquiriesCount, recentProperties] = await Promise.all([
    prisma.property.count({
      where: { userId: user.id },
    }),
    prisma.inquiry.count({
      where: {
        OR: [{ userId: user.id }, { phone: user.phone }],
      },
    }),
    prisma.property.findMany({
      where: { userId: user.id },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          take: 1,
          orderBy: { order: "asc" },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-8 text-right">
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-blue-100 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>حساب کاربری فعال</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            سلام، {user.name} عزیز خوش آمدید
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
            از طریق این بخش می‌توانید آگهی‌های ثبت‌شده خود را مدیریت نموده، وضعیت بررسی آن‌ها را مشاهده فرمایید و درخواست‌های مشاوره خود را پیگیری کنید.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">آگهی‌های من</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {formatNumber(propertiesCount)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">ملک ثبت‌شده توسط شما</p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
              <Mail className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">درخواست‌ها</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {formatNumber(inquiriesCount)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">پیام یا درخواست مشاوره ارسال‌شده</p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">سطح حساب</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
            کاربر ویژه
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">دسترسی نامحدود به ثبت آگهی رایگان</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              آخرین آگهی‌های ثبت‌شده شما
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              لیست فایل‌های ملکی که در سامانه مسکن پلاس منتشر نموده‌اید
            </p>
          </div>
          <Link
            href="/panel/properties"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <span>مشاهده همه</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentProperties.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                هنوز آگهی ملکی ثبت نکرده‌اید
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                ملک خود را برای فروش یا رهن و اجاره ثبت فرمایید تا در معرض دید هزاران خریدار و مستاجر قرار گیرد.
              </p>
            </div>
            <Link href="/submit-property">
              <Button variant="primary" size="sm" rightIcon={<PlusCircle className="h-4 w-4" />}>
                ثبت رایگان اولین ملک
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentProperties.map((prop) => (
              <div
                key={prop.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                    <img
                      src={prop.images[0]?.url || "/images/properties/prop-1.webp"}
                      alt={prop.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={prop.listingType === "SALE" ? "sale" : "rent"} size="sm">
                        {prop.listingType === "SALE" ? "فروش" : "رهن و اجاره"}
                      </Badge>
                      <span className="text-[11px] text-slate-400">{prop.city}</span>
                    </div>
                    <Link
                      href={`/properties/${prop.slug}`}
                      className="block truncate font-bold text-slate-900 dark:text-white text-xs sm:text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {prop.title}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {prop.listingType === "SALE"
                      ? formatPrice(prop.price)
                      : formatPrice(prop.deposit, "تومان", { fallbackToNegotiable: true })}
                  </span>
                  <Link href={`/properties/${prop.slug}`}>
                    <Button variant="outline" size="sm">
                      مشاهده صفحه ملک
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/submit-property"
          className="group flex items-center justify-between p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                ثبت ملک جدید
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">واگذاری فروش یا اجاره</p>
            </div>
          </div>
          <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </Link>

        <Link
          href="/properties"
          className="group flex items-center justify-between p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                جستجوی املاک
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">بررسی همه فایل‌های فعال</p>
            </div>
          </div>
          <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </Link>

        <Link
          href="/compare"
          className="group flex items-center justify-between p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                مقایسه هوشمند
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">بررسی تطبیقی فایل‌ها</p>
            </div>
          </div>
          <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
