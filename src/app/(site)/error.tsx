"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw, Home, Search, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 ring-8 ring-rose-500/5 dark:ring-rose-500/10">
          <AlertCircle className="h-10 w-10 stroke-[1.8]" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
          خطایی در بارگذاری صفحه رخ داد
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          متأسفانه در دریافت اطلاعات یا اجرای عملیات مشکلی پیش آمده است. لطفاً مجدداً تلاش فرمایید یا به صفحه اصلی بازگردید.
        </p>

        {error?.digest && (
          <p className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg px-2.5 py-1 inline-block">
            شناسه پیگیری: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => reset()}
            rightIcon={<RefreshCcw className="h-4 w-4" />}
          >
            تلاش مجدد
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              rightIcon={<Home className="h-4 w-4" />}
            >
              صفحه اصلی
            </Button>
          </Link>
        </div>

        <div className="mt-8 border-t border-slate-200/80 dark:border-slate-800 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link href="/properties" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Search className="h-3.5 w-3.5" />
              <span>جستجوی املاک</span>
            </Link>
            <span>•</span>
            <Link href="/contact" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>پشتیبانی سرپناه</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
