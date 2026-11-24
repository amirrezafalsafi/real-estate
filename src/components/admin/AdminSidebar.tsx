"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Mail,
  Settings,
  ShieldCheck,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "پیشخوان و آمار",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "مدیریت املاک",
      href: "/admin/properties",
      icon: Building2,
      exact: false,
    },
    {
      name: "درخواست‌های مشاوره",
      href: "/admin/inquiries",
      icon: Mail,
      exact: false,
    },
    {
      name: "تنظیمات سامانه",
      href: "/admin/settings",
      icon: Settings,
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 shrink-0 border-l border-slate-800 bg-slate-950 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 border-b border-slate-800/80 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400 border border-blue-500/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-black text-sm text-white">پنل مدیریت املاک</span>
            <span className="text-[11px] font-medium text-slate-400">سامانه مسکن پلاس</span>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          {navigation.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-black"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active ? "text-white stroke-[2.5]" : "text-slate-500"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-850">
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-3 text-center">
          <span className="block text-[11px] font-bold text-slate-300">نسخه ۱.۰.۰ مدیریت</span>
          <span className="block text-[10px] text-slate-500 mt-0.5">امنیت با نشست رمزنگاری‌شده</span>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
