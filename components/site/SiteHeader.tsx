"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Menu,
  X,
  Scale,
  Home,
  PhoneCall,
  PlusCircle,
  Layers,
} from "lucide-react";
import { useCompare } from "./CompareContext";
import { toPersianDigits } from "@/lib/format";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { compareIds, isMounted } = useCompare();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const effectiveCompareCount = isMounted ? compareIds.length : 0;

  const navLinks = [
    { label: "صفحه اصلی", href: "/", icon: Home },
    { label: "املاک", href: "/properties", icon: Layers },
    {
      label: "مقایسه",
      href: effectiveCompareCount === 2 ? `/compare?ids=${compareIds.join(",")}` : "/compare",
      icon: Scale,
      badge: effectiveCompareCount > 0 ? toPersianDigits(effectiveCompareCount) : null,
    },
    { label: "تماس با ما", href: "/contact", icon: PhoneCall },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md transition-transform duration-200 group-hover:scale-105">
              <Building2 className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                مسکن <span className="text-blue-600 dark:text-blue-400">پلاس</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                سامانه هوشمند خرید و اجاره ملک
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all duration-150 ${
                    active
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        active
                          ? "bg-white text-blue-700"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Link
            href="/submit-property"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 text-sm font-bold shadow-sm active:scale-95 transition-all"
          >
            <PlusCircle className="h-4 w-4 stroke-[2.5]" />
            <span>ثبت آگهی رایگان</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="منوی موبایل"
            className="inline-flex md:hidden items-center justify-center rounded-xl p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-50 bg-slate-950/50 backdrop-blur-xs md:hidden animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 text-right">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                      active
                        ? "bg-blue-600 text-white font-extrabold"
                        : "text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${active ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 text-xs font-bold">
                        {item.badge} ملک
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              <Link
                href="/submit-property"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-3 text-sm font-bold shadow-sm"
              >
                <PlusCircle className="h-4 w-4" />
                <span>ثبت آگهی رایگان ملک</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default SiteHeader;
