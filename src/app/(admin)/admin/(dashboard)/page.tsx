import React from "react";
import type { Metadata } from "next";
import {
  Building2,
  Mail,
  CheckCircle2,
  MapPin,
  Phone,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatNumber, formatPrice, toPersianDigits } from "@/lib/format";

export const metadata: Metadata = {
  title: "داشبورد مدیریت | مسکن پلاس",
  description: "خلاصه آمار و وضعیت سامانه املاک و مستغلات مسکن پلاس",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const [
    totalProperties,
    newInquiries,
    totalInquiries,
    activeProperties,
    recentInquiries,
    recentProperties,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.inquiry.count({ where: { isRead: false } }),
    prisma.inquiry.count(),
    prisma.property.count({ where: { status: "ACTIVE" } }),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    }),
    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400">📊</span>
            <span>پیشخوان و خلاصه آمار سامانه</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            بررسی وضعیت لحظه‌ای املاک، پیام‌ها و مراجعات کاربران
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            سیستم فعال و آنلاین
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xs dark:shadow-lg backdrop-blur-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">کل املاک ثبت‌شده</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-500/20">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
            {formatNumber(totalProperties)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>در دیتابیس سامانه</span>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-blue-50/70 dark:bg-gradient-to-br dark:from-blue-500/10 dark:via-slate-900 dark:to-slate-900 p-5 shadow-xs dark:shadow-lg transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">درخواست‌های جدید مشاوره</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black shadow-md shadow-blue-500/20">
              <Mail className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-blue-600 dark:text-blue-400">
            {formatNumber(newInquiries)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-600/80 dark:text-blue-200/80">
            <span>نیاز به بررسی و پاسخگویی</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xs dark:shadow-lg backdrop-blur-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">املاک فعال و آماده معامله</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {formatNumber(activeProperties)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>منتشرشده در وب‌سایت</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xs dark:shadow-lg backdrop-blur-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">کل تماس‌ها و پیام‌ها</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <Phone className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
            {formatNumber(totalInquiries)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>کل درخواست‌های ثبت‌شده</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl lg:col-span-7 transition-colors">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>آخرین درخواست‌های مشاوره و بازدید</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                لیست متقاضیان و درخواست‌های ارتباط اخیر
              </p>
            </div>
            <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {toPersianDigits(newInquiries)} جدید
            </span>
          </div>

          {recentInquiries.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              هنوز درخواست مشاوره‌ای ثبت نشده است.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-200">
                      {inquiry.name}
                    </span>
                    <span className="font-mono text-xs text-blue-600 dark:text-blue-400 dir-ltr">
                      {inquiry.phone}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {inquiry.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    {inquiry.property ? (
                      <span className="text-slate-600 dark:text-slate-400 truncate max-w-[250px]">
                        ملک: {inquiry.property.title}
                      </span>
                    ) : (
                      <span>مشاوره عمومی</span>
                    )}

                    <span className={inquiry.isRead ? "text-slate-400 dark:text-slate-500" : "text-blue-600 dark:text-blue-400 font-bold"}>
                      {inquiry.isRead ? "خوانده شده" : "جدید و خوانده نشده"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm dark:shadow-xl lg:col-span-5 transition-colors">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>آخرین املاک ثبت‌شده</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">جدیدترین فایل‌های ثبت‌شده</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentProperties.map((prop) => (
              <div key={prop.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-slate-200 truncate max-w-[200px]">
                    {prop.title}
                  </h3>
                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {prop.listingType === "SALE" ? "فروش" : "اجاره"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                    <span>{prop.city}</span>
                  </span>

                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {prop.listingType === "SALE"
                      ? formatPrice(prop.price, "تومان", { fallbackToNegotiable: true })
                      : formatPrice(prop.deposit, "تومان", { fallbackToNegotiable: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
