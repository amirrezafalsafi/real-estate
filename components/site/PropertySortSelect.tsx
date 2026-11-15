"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

interface PropertySortSelectProps {
  currentSort: string;
}

export function PropertySortSelect({ currentSort }: PropertySortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    params.delete("page");
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="relative">
      <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pr-8 pl-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer focus:border-blue-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 transition-colors"
        aria-label="مرتب‌سازی آگهی‌ها"
      >
        <option value="newest">جدیدترین‌ها</option>
        <option value="cheapest">ارزان‌ترین قیمت</option>
        <option value="most_expensive">گران‌ترین قیمت</option>
        <option value="largest">بیشترین متراژ</option>
      </select>
    </div>
  );
}
