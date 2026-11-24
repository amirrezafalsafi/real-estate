"use client";

import React, { useState } from "react";
import { Share2, Copy } from "lucide-react";

export function CompareShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "مقایسه تخصصی املاک در مسکن پلاس",
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

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
    >
      {copied ? (
        <>
          <Copy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-emerald-700 dark:text-emerald-300">لینک مقایسه کپی شد</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span>اشتراک‌گذاری این مقایسه</span>
        </>
      )}
    </button>
  );
}

export default CompareShareButton;
