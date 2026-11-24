"use client";

import React, { useState, useRef, useEffect } from "react";
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
  User as UserIcon,
  LogIn,
  LogOut,
  LayoutDashboard,
  FileText,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";
import { useCompare } from "./CompareContext";
import { toPersianDigits } from "@/lib/format";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useUserAuth } from "@/components/providers/UserAuthProvider";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { compareIds, isMounted } = useCompare();
  const { user, isLoading, logout } = useUserAuth();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const getUserInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]} ${parts[1][0]}`;
    }
    return name.slice(0, 2);
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
            className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all"
          >
            <PlusCircle className="h-4 w-4 stroke-[2.5]" />
            <span>ثبت آگهی رایگان</span>
          </Link>

          {!isLoading && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black shadow-2xs">
                  {getUserInitials(user.name)}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl animate-in fade-in duration-150 z-50 text-right">
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5" dir="ltr">
                      {user.phone}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/panel"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>داشبورد پنل کاربری</span>
                    </Link>

                    <Link
                      href="/panel/properties"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <FileText className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span>آگهی‌های ثبت‌شده من</span>
                    </Link>

                    <Link
                      href="/panel/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span>تنظیمات حساب کاربری</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>خروج از حساب</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : !isLoading ? (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-600/30 dark:border-blue-500/30 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 px-3.5 py-2 text-xs sm:text-sm font-bold transition-all shadow-2xs"
            >
              <LogIn className="h-4 w-4" />
              <span>ورود / ثبت‌نام</span>
            </Link>
          ) : null}

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
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 text-right max-h-[calc(100vh-5rem)] overflow-y-auto">
            {!isLoading && user ? (
              <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
                      {getUserInitials(user.name)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5" dir="ltr">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/60 dark:border-blue-900/60">
                  <Link
                    href="/panel"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 text-white px-3 py-2 text-xs font-bold shadow-2xs"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>داشبورد من</span>
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 px-3 py-2 text-xs font-bold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>خروج</span>
                  </button>
                </div>
              </div>
            ) : !isLoading ? (
              <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 p-4 flex items-center justify-between">
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm">حساب کاربری</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">برای مدیریت آگهی‌ها وارد شوید</p>
                </div>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 text-white px-4 py-2 text-xs font-bold shadow-xs"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>ورود / ثبت‌نام</span>
                </Link>
              </div>
            ) : null}

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
