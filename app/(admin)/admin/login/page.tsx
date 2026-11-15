"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "ایمیل یا رمز عبور اشتباه است.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setErrorMessage("خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-right">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-xl shadow-blue-500/10">
            <ShieldCheck className="h-9 w-9 stroke-[1.8]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            ورود به پنل مدیریت
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            سامانه تخصصی املاک و مستغلات مسکن پلاس
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-300"
              >
                ایمیل مدیر
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maskanplus.ir"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 pl-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-left font-sans"
                />
                <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-300"
              >
                رمز عبور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 pl-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-left font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-black text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>در حال اعتبارسنجی...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>ورود امن به پنل</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-800/80 pt-5 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              کلیه تلاش‌های ورود به سامانه با ثبت آدرس IP و اعتبارسنجی رمزنگاری‌شده رصد و حفاظت
              می‌شوند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
