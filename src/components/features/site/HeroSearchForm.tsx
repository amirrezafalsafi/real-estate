"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeroSearchFormProps {
  cities: string[];
}

export function HeroSearchForm({ cities }: HeroSearchFormProps) {
  const router = useRouter();
  const [listingType, setListingType] = useState<"SALE" | "RENT">("SALE");
  const [propertyType, setPropertyType] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (listingType) params.set("listingType", listingType);
    if (propertyType) params.set("propertyType", propertyType);
    if (city) params.set("city", city);
    if (query.trim()) params.set("query", query.trim());

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl text-right transition-colors">
      <div className="mb-5 flex items-center justify-start gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => setListingType("SALE")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
            listingType === "SALE"
              ? "bg-blue-600 text-white shadow-md scale-[1.02]"
              : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50/50 dark:hover:bg-slate-800/60"
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>خرید ملک</span>
        </button>

        <button
          type="button"
          onClick={() => setListingType("RENT")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
            listingType === "RENT"
              ? "bg-blue-600 text-white shadow-md scale-[1.02]"
              : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50/50 dark:hover:bg-slate-800/60"
          }`}
        >
          <Building className="h-4 w-4" />
          <span>رهن و اجاره</span>
        </button>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-center">
        <div className="relative sm:col-span-3">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            شهر
          </label>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/90 px-3.5 py-3 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer pl-9 transition-colors"
            >
              <option value="">همه شهرها</option>
              {cities.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {c}
                </option>
              ))}
            </select>
            <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="relative sm:col-span-3">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            نوع کاربری
          </label>
          <div className="relative">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/90 px-3.5 py-3 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer pl-9 transition-colors"
            >
              <option value="">همه انواع ملک</option>
              <option value="APARTMENT" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                آپارتمان
              </option>
              <option value="VILLA" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                ویلا
              </option>
              <option value="LAND" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                زمین و کلنگی
              </option>
              <option value="OFFICE" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                اداری و شرکت
              </option>
              <option value="SHOP" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                مغازه و تجاری
              </option>
            </select>
            <Building className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="relative sm:col-span-4">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            جستجوی نام محله یا کلیدواژه
          </label>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثلاً سعادت‌آباد، نیاوران، نوساز..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/90 pr-3 pl-9 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="sm:col-span-2 sm:self-end">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full h-11.5 font-bold shadow-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
            rightIcon={<Search className="h-4 w-4 stroke-[2.5]" />}
          >
            جستجو
          </Button>
        </div>
      </form>
    </div>
  );
}

export default HeroSearchForm;
