import React from "react";
import type { Metadata } from "next";
import { Settings, Shield, Database } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "تنظیمات سامانه | پنل مدیریت",
  description: "تنظیمات فنی، امنیتی و پیکربندی سامانه مسکن پلاس",
};

export default async function AdminSettingsPage() {
  const admin = await prisma.adminUser.findFirst();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span>تنظیمات و پیکربندی سامانه</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          اطلاعات پایگاه‌داده، لایه‌های امنیتی و حساب مدیر ارشد
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-600/15 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">حساب مدیر فعال</h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">احراز هویت رمزنگاری‌شده</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">نام مدیر:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{admin?.name || "مدیر ارشد سامانه"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">ایمیل:</span>
              <span className="font-mono text-slate-900 dark:text-slate-100">{admin?.email || "admin@maskanplus.ir"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">الگوریتم هش کلمه عبور:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Bcrypt (Salt 10)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 dark:text-slate-400">نوع نشست:</span>
              <span className="text-slate-700 dark:text-slate-300">Signed httpOnly Cookie (JWT via jose)</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 space-y-4 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">زیرساخت پایگاه‌داده</h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Prisma ORM با پشتیبانی Driver Adapter</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">پایگاه داده کنونی:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">SQLite (dev.db)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">قابلیت مهاجرت به:</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">PostgreSQL (آماده تعویض در env)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">محدودکننده نرخ ورود:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">فعال (حداکثر ۵ تلاش در ۱۵ دقیقه)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 dark:text-slate-400">وضعیت کش و بهینه‌سازی:</span>
              <span className="text-slate-700 dark:text-slate-300">Partial Prerendering (PPR) + revalidatePath</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
