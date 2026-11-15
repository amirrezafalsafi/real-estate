import React from "react";
import Link from "next/link";
import { Home, Search, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto max-w-md">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5">
          <Building2 className="h-12 w-12 stroke-[1.5]" />
          <span className="absolute -bottom-2 -right-2 rounded-lg bg-slate-900 px-2 py-0.5 text-xs font-bold text-amber-400 shadow-md">
            ۴۰۴
          </span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
          صفحه یا ملک مورد نظر یافت نشد
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          متأسفانه این آدرس وجود ندارد، حذف شده یا ممکن است آدرس ملک را اشتباه وارد کرده باشید.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/properties">
            <Button
              variant="accent"
              size="lg"
              className="w-full sm:w-auto"
              rightIcon={<Search className="h-4 w-4" />}
            >
              جستجوی همه املاک
            </Button>
          </Link>

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

        <div className="mt-10 border-t border-slate-200/80 pt-6">
          <p className="text-xs font-semibold text-slate-500">مسیرهای پرکاربرد:</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link
              href="/properties?listingType=SALE"
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-amber-100 hover:text-amber-900 transition-colors"
            >
              املاک خرید و فروش
              <ArrowRight className="h-3 w-3 rotate-180 text-slate-400" />
            </Link>
            <Link
              href="/properties?listingType=RENT"
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-amber-100 hover:text-amber-900 transition-colors"
            >
              رهن و اجاره
              <ArrowRight className="h-3 w-3 rotate-180 text-slate-400" />
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-amber-100 hover:text-amber-900 transition-colors"
            >
              مقایسه املاک
              <ArrowRight className="h-3 w-3 rotate-180 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
