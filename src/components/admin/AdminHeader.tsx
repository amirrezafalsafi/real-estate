import React from "react";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { Shield, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AdminHeader() {
  return (
    <header className="h-18 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-500/20">
          <Shield className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100">میز کار و پیشخوان مدیریت</h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">کنترل املاک و درخواست‌های ثبت شده</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle className="border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300" />

        <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3.5 py-1.5 text-right transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-bold text-xs">
            <User className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">مدیر ارشد سامانه</span>
            <span className="block text-[10px] text-slate-500">admin@sarpanah.ir</span>
          </div>
        </div>

        <AdminLogoutButton />
      </div>
    </header>
  );
}

export default AdminHeader;
