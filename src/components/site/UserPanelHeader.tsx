"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ChevronLeft,
  LayoutDashboard,
  Building2,
  Mail,
  Bookmark,
  User,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { UserSessionData } from "@/lib/user-auth";

interface UserPanelHeaderProps {
  user: UserSessionData;
}

export function UserPanelHeader({ user }: UserPanelHeaderProps) {
  const pathname = usePathname();

  const getBreadcrumbTitle = () => {
    if (pathname === "/panel") return "پیشخوان کاربری";
    if (pathname.startsWith("/panel/properties")) return "املاک و آگهی‌های من";
    if (pathname.startsWith("/panel/inquiries")) return "درخواست‌های مشاوره و پیام‌ها";
    if (pathname.startsWith("/panel/favorites")) return "املاک نشان‌شده";
    if (pathname.startsWith("/panel/profile")) return "تنظیمات حساب کاربری";
    return "پنل کاربری";
  };

  const getUserInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]} ${parts[1][0]}`;
    return name.slice(0, 2);
  };

  return (
    <header className="mb-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:px-6 shadow-xs transition-colors flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>صفحه اصلی</span>
        </Link>
        <ChevronLeft className="h-3 w-3 text-slate-300 dark:text-slate-600" />
        <Link
          href="/panel"
          className="font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          پنل کاربری
        </Link>
        <ChevronLeft className="h-3 w-3 text-slate-300 dark:text-slate-600" />
        <span className="font-black text-blue-600 dark:text-blue-400">
          {getBreadcrumbTitle()}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <Link
          href="/submit-property"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>ثبت آگهی</span>
        </Link>

        <Link
          href="/panel/profile"
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-blue-300 transition-colors"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white text-[11px] font-black">
            {getUserInitials(user.name)}
          </div>
          <span className="hidden md:inline max-w-[120px] truncate">{user.name}</span>
        </Link>
      </div>
    </header>
  );
}

export default UserPanelHeader;
