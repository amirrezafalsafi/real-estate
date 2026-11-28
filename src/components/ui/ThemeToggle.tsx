"use client";

import React, { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const subscribe = () => () => {};

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return (
      <div
        className={`h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleTheme(e);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"}
      title={isDark ? "حالت روشن" : "حالت تاریک"}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 p-2.5 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 hover:shadow-xs active:scale-95 ${className}`}
    >
      <div className="relative h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 text-blue-600 dark:text-blue-400 transition-all duration-500 ease-out ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 text-blue-500 dark:text-blue-400 transition-all duration-500 ease-out ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-bold">
          {isDark ? "حالت روشن" : "حالت تاریک"}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
