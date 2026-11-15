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
            ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
            : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        {inCompare ? (
          <>
            <Check className="h-4 w-4 stroke-[3]" />
            <span>در لیست مقایسه</span>
          </>
        ) : (
          <>
            <Scale className="h-4 w-4 text-slate-500" />
            <span>افزودن به مقایسه</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-all"
        title="اشتراک‌گذاری این ملک"
      >
        {copied ? (
          <>
            <Copy className="h-4 w-4 text-emerald-600" />
            <span className="text-emerald-700">لینک کپی شد</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4 text-slate-500" />
            <span>اشتراک‌گذاری</span>
          </>
        )}
      </button>
    </div>
  );
}

export default PropertyDetailActions;
