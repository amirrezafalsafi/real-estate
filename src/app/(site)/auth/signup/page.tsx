"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus, User, Phone, Mail, Lock, Eye, EyeOff, Building2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/components/providers/UserAuthProvider";

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/panel";
  const { refreshUser } = useUser();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email.trim() || undefined,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در ثبت‌نام");
        setIsLoading(false);
        return;
      }

      await refreshUser();
      router.push(redirectUrl);
      router.refresh();
    } catch {
      setError("خطای غیرمنتظره رخ داد. لطفاً مجدداً تلاش فرمایید.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25 transition-transform group-hover:scale-105">
            <Building2 className="h-6 w-6 stroke-[2.2]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            مسکن <span className="text-blue-600 dark:text-blue-400">پلاس</span>
          </span>
        </Link>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
          ایجاد حساب کاربری رایگان
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          ثبت رایگان ملک، پیگیری مشاوره‌ها و دسترسی به امکانات ویژه
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl transition-colors">
        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs font-bold text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5"
            >
              نام و نام خانوادگی <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: علی احمدی"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pr-10 pl-4 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
              />
              <User className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5"
            >
              شماره موبایل <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09123456789"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pr-10 pl-4 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
                dir="ltr"
              />
              <Phone className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5"
            >
              پست الکترونیک (اختیاری)
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@example.com"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pr-10 pl-4 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
                dir="ltr"
              />
              <Mail className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5"
            >
              رمز عبور <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="حداقل ۶ کاراکتر"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pr-10 pl-10 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
                dir="ltr"
              />
              <Lock className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5"
            >
              تکرار رمز عبور <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="تکرار همان رمز عبور"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pr-10 pl-4 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
                dir="ltr"
              />
              <Lock className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            disabled={isLoading}
            rightIcon={<UserPlus className="h-4 w-4" />}
          >
            {isLoading ? "در حال ایجاد حساب..." : "تکمیل ثبت‌نام و ورود"}
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>قبلاً حساب کاربری داشته‌اید؟ </span>
          <Link
            href={`/auth/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            ورود به حساب
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="h-110 w-full max-w-md rounded-3xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />}>
        <SignupFormContent />
      </Suspense>
    </div>
  );
}
