"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { useUserAuth } from "@/components/providers/UserAuthProvider";

interface FavoriteButtonProps {
  propertyId: string;
  initialIsFavorite?: boolean;
  showLabel?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({
  propertyId,
  initialIsFavorite = false,
  showLabel = false,
  className = "",
  size = "md",
}: FavoriteButtonProps) {
  const router = useRouter();
  const { user } = useUserAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }

    let isMounted = true;
    fetch(`/api/user/favorites?propertyId=${propertyId}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && typeof data.isFavorite === "boolean") {
          setIsFavorite(data.isFavorite);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [propertyId, user]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/properties";
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const previousState = isFavorite;
    setIsFavorite(!previousState);

    try {
      const res = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      const data = await res.json();
      if (res.ok && typeof data.isFavorite === "boolean") {
        setIsFavorite(data.isFavorite);
      } else {
        setIsFavorite(previousState);
      }
    } catch {
      setIsFavorite(previousState);
    } finally {
      setIsLoading(false);
    }
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  if (showLabel) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={isFavorite ? "حذف از نشان‌شده‌ها" : "نشان کردن ملک"}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs ${
          isFavorite
            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40"
            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin text-rose-500`} />
        ) : (
          <Heart
            className={`${iconSizes[size]} transition-transform active:scale-125 ${
              isFavorite
                ? "fill-rose-500 text-rose-500"
                : "text-slate-500 dark:text-slate-400"
            }`}
          />
        )}
        <span>{isFavorite ? "نشان‌شده" : "نشان کردن"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isFavorite ? "حذف از نشان‌شده‌ها" : "نشان کردن ملک"}
      className={`inline-flex items-center justify-center rounded-xl p-2 transition-all backdrop-blur-xs ${
        isFavorite
          ? "bg-rose-50/90 dark:bg-rose-950/70 text-rose-500 shadow-sm border border-rose-200/80 dark:border-rose-800/80 hover:bg-rose-100"
          : "bg-slate-900/60 hover:bg-slate-900/80 text-white shadow-xs hover:text-rose-400"
      } ${className}`}
      title={isFavorite ? "نشان‌شده در پنل کاربری" : "نشان کردن این ملک"}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin text-rose-400`} />
      ) : (
        <Heart
          className={`${iconSizes[size]} transition-transform active:scale-125 ${
            isFavorite ? "fill-rose-500 text-rose-500" : ""
          }`}
        />
      )}
    </button>
  );
}
