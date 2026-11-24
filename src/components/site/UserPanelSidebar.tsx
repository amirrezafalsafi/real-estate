"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Mail,
  Settings,
  PlusCircle,
  LogOut,
  User,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { useUser } from "@/components/providers/UserAuthProvider";
import { toPersianDigits } from "@/lib/format";
import type { UserSessionData } from "@/lib/user-auth";

interface UserPanelSidebarProps {
  user: UserSessionData;
}

export function UserPanelSidebar({ user }: UserPanelSidebarProps) {
  const pathname = usePathname();
  const { logout } = useUser();

  const navItems = [
    { label: "پیشخوان کاربری", href: "/panel", icon: LayoutDashboard },
    { label: "آگهی‌های من", href: "/panel/properties", icon: Building2 },
    { label: "درخواست‌های من", href: "/panel/inquiries", icon: Mail },
    { label: "تنظیمات حساب", href: "/panel/profile", icon: Settings },
  ];

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]} ${parts[1][0]}`;
    return name.slice(0, 2);
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs text-right transition-colors space-y-5">
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white font-black text-base shadow-md shadow-blue-500/20">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-black text-slate-900 dark:text-white truncate" title={user.name}>
              {user.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate" dir="ltr">
              {toPersianDigits(user.phone)}
            </p>
          </div>
        </div>

        <nav className="space-y-1.5" aria-label="منوی پنل کاربری">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronLeft className={`h-3.5 w-3.5 transition-transform ${isActive ? "text-white" : "text-slate-400"}`} />
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <Link
            href="/submit-property"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 py-2.5 px-3 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors w-full"
          >
            <PlusCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>ثبت رایگان ملک جدید</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            <span>خروج از حساب</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default UserPanelSidebar;
