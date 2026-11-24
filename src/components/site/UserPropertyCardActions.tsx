"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Trash2,
  Share2,
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";

interface UserPropertyCardActionsProps {
  propertyId: string;
  slug: string;
  currentStatus: string;
  listingType: string;
}

export function UserPropertyCardActions({
  propertyId,
  slug,
  currentStatus,
  listingType,
}: UserPropertyCardActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setShowStatusMenu(false);
    if (newStatus === status) return;

    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/user/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch {
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/user/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch {
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/properties/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusLabels: Record<string, string> = {
    ACTIVE: "آماده معامله",
    SOLD: "فروخته‌شده",
    RENTED: "واگذارشده",
    HIDDEN: "مخفی‌شده",
  };

  return (
    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="relative">
          <button
            type="button"
            disabled={isUpdatingStatus}
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
          >
            {isUpdatingStatus ? (
              <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
            ) : (
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "ACTIVE"
                    ? "bg-emerald-500"
                    : status === "SOLD" || status === "RENTED"
                    ? "bg-amber-500"
                    : "bg-slate-400"
                }`}
              />
            )}
            <span>{statusLabels[status] || status}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showStatusMenu && (
            <div className="absolute right-0 bottom-full mb-1.5 w-40 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl z-20 space-y-0.5 text-right animate-in fade-in">
              <button
                type="button"
                onClick={() => handleStatusChange("ACTIVE")}
                className="w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>آماده معامله</span>
                {status === "ACTIVE" && <Check className="h-3 w-3 text-emerald-600" />}
              </button>
              {listingType === "SALE" ? (
                <button
                  type="button"
                  onClick={() => handleStatusChange("SOLD")}
                  className="w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>فروخته شد</span>
                  {status === "SOLD" && <Check className="h-3 w-3 text-amber-600" />}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStatusChange("RENTED")}
                  className="w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>واگذار شد</span>
                  {status === "RENTED" && <Check className="h-3 w-3 text-amber-600" />}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleStatusChange("HIDDEN")}
                className="w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>مخفی‌سازی موقت</span>
                {status === "HIDDEN" && <Check className="h-3 w-3 text-slate-400" />}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            title={copied ? "لینک کپی شد" : "اشتراک‌گذاری"}
            className="rounded-xl p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
          </button>

          <Link
            href={`/properties/${slug}`}
            title="مشاهده در سایت"
            className="rounded-xl p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </Link>

          {confirmDelete ? (
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 text-[11px] font-bold"
              >
                {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "حذف"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300"
              >
                انصراف
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              title="حذف آگهی"
              className="rounded-xl p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
