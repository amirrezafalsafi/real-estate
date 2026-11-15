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
      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-all"
    >
      {copied ? (
        <>
          <Copy className="h-4 w-4 text-emerald-600" />
          <span className="text-emerald-700">لینک مقایسه کپی شد</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 text-slate-500" />
          <span>اشتراک‌گذاری این مقایسه</span>
        </>
      )}
    </button>
  );
}

export default CompareShareButton;
