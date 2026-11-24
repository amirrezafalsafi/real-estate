"use client";

import React, { useState } from "react";
import { User, Lock, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useUserAuth } from "@/components/providers/UserAuthProvider";

export default function UserProfileSettingsPage() {
  const { user, refreshUser } = useUserAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("لطفاً نام و نام خانوادگی خود را وارد فرمایید.");
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        setErrorMessage("جهت تعیین رمز عبور جدید، وارد کردن رمز عبور فعلی الزامی است.");
        return;
      }
      if (newPassword.length < 6) {
        setErrorMessage("رمز عبور جدید باید حداقل ۶ کاراکتر باشد.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage("تکرار رمز عبور جدید با رمز وارد شده مطابقت ندارد.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "خطا در ویرایش اطلاعات حساب.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("اطلاعات حساب کاربری شما با موفقیت ذخیره شد.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await refreshUser();
    } catch {
      setErrorMessage("خطای غیرمنتظره در برقراری ارتباط با سرور رخ داد.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>اطلاعات کاربری و امنیت</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مشخصات فردی، آدرس ایمیل و کلمه عبور حساب کاربری خود را به‌روزرسانی فرمایید.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-rose-800 dark:text-rose-300 text-xs sm:text-sm font-bold animate-in fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-black text-base">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>مشخصات فردی و تماس</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="name-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                نام و نام خانوادگی <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مانند: علی محمدی"
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                شماره موبایل
              </label>
              <div className="relative flex items-center">
                <input
                  id="phone-input"
                  type="text"
                  value={user?.phone || ""}
                  disabled
                  readOnly
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-850 px-4 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed text-left"
                />
                <span className="absolute left-3 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                  ثابت
                </span>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label htmlFor="email-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                پست الکترونیک (ایمیل)
              </label>
              <div className="relative">
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors text-left"
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                از این ایمیل جهت بازیابی حساب و دریافت اعلانات پیام‌های مشاورین استفاده خواهد شد.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-black text-base">
            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>تغییر رمز عبور (اختیاری)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label htmlFor="current-password-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                رمز عبور فعلی
              </label>
              <input
                id="current-password-input"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors text-left"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="new-password-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                رمز عبور جدید
              </label>
              <input
                id="new-password-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="حداقل ۶ کاراکتر"
                dir="ltr"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors text-left"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                تکرار رمز عبور جدید
              </label>
              <input
                id="confirm-password-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="تکرار رمز جدید"
                dir="ltr"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors text-left"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>در حال ذخیره‌سازی...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>ذخیره تغییرات حساب</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
