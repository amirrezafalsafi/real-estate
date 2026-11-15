"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Scale, X, AlertTriangle, ArrowLeft, Plus } from "lucide-react";
import { useCompare } from "./CompareContext";
import { formatPrice } from "@/lib/format";

export function CompareFloatingBar() {
  const {
    compareItems,
    compareIds,
    isMounted,
    removeFromCompare,
    clearCompare,
    limitWarning,
    dismissWarning,
  } = useCompare();

  if (!isMounted) {
    return null;
  }

  if (compareItems.length === 0 && !limitWarning) {
    return null;
  }

  const isReady = compareItems.length === 2;
  const compareUrl = `/compare?ids=${compareIds.join(",")}`;

  return (
    <aside aria-label="نوار مقایسه املاک" className="fixed bottom-4 inset-x-4 z-40 mx-auto max-w-4xl">
      {limitWarning && (
        <div className="mb-2 flex items-center justify-between gap-3 rounded-2xl bg-blue-600 text-white px-4 py-2.5 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300 font-bold text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-white" />
            <span>{limitWarning}</span>
          </div>
          <button
            type="button"
            onClick={dismissWarning}
            className="rounded-lg p-1 hover:bg-blue-700 transition-colors"
            aria-label="بستن پیام هشدار"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {compareItems.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-3.5 sm:p-4 text-white shadow-2xl backdrop-blur-md transition-all sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
            <div className="hidden lg:flex flex-col items-center justify-center border-l border-slate-700/80 pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Scale className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1">مقایسه</span>
            </div>

            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {compareItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 p-1.5 pr-2 pl-3 shadow-inner min-w-[150px] sm:min-w-[190px] max-w-[240px]"
                >
                  <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-700">
                    <Image
                      src={
                        item.image ||
                        "/images/properties/prop-1.webp"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 text-right">
                    <span className="block text-[10px] font-medium text-blue-400">
                      ملک {index === 0 ? "اول" : "دوم"}
                    </span>
                    <p className="truncate text-xs font-semibold text-slate-100" title={item.title}>
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {item.listingType === "RENT"
                        ? formatPrice(item.deposit, "تومان", { fallbackToNegotiable: true })
                        : formatPrice(item.price, "تومان", { fallbackToNegotiable: true })}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCompare(item.id)}
                    className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                    aria-label={`حذف ${item.title} از لیست مقایسه`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {!isReady && (
                <Link
                  href="/properties"
                  className="hidden sm:flex items-center gap-2 rounded-xl border border-dashed border-slate-600 bg-slate-800/40 px-3 py-2 text-xs font-medium text-slate-400 hover:border-blue-500/60 hover:text-blue-400 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>یک ملک دیگر را برای مقایسه انتخاب کنید</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors px-2 py-1.5"
            >
              پاکسازی همه
            </button>

            {isReady ? (
              <Link
                href={compareUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-500 active:scale-95 transition-all"
              >
                <span>مشاهده جدول مقایسه</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/properties"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <span>انتخاب ملک دوم ({compareItems.length}/۲)</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

export default CompareFloatingBar;
