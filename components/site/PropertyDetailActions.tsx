"use client";

import React, { useState } from "react";
import { Scale, Check, Share2, Copy } from "lucide-react";
import { useCompare } from "./CompareContext";

interface PropertyDetailActionsProps {
  propertyId: string;
  title: string;
  price?: number | null;
  deposit?: number | null;
  monthlyRent?: number | null;
  listingType?: string;
  image?: string;
  city?: string;
}

export function PropertyDetailActions({
  propertyId,
  title,
  price,
  deposit,
  monthlyRent,
  listingType,
  image,
  city,
}: PropertyDetailActionsProps) {
  const { isInCompare, toggleCompare } = useCompare();
  const inCompare = isInCompare(propertyId);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch {
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
      }
    }
  };

  const handleToggleCompare = () => {
    toggleCompare({
      id: propertyId,
      title,
      price,
      deposit,
      monthlyRent,
      listingType,
      image,
      city,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggleCompare}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs ${
          inCompare
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        {inCompare ? (
          <>
            <Check className="h-4 w-4 stroke-[3]" />
            <span>در لیست مقایسه</span>
          </>
        ) : (
          <>
            <Scale className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>افزودن به مقایسه</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        title="اشتراک‌گذاری این ملک"
      >
        {copied ? (
          <>
            <Copy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-700 dark:text-emerald-300">لینک کپی شد</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>اشتراک‌گذاری</span>
          </>
        )}
      </button>
    </div>
  );
}

export default PropertyDetailActions;
