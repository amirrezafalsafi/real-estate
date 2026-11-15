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
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-700/80 bg-slate-900/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl text-right">

      <div className="mb-5 flex items-center justify-start gap-2 border-b border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => setListingType("SALE")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
            listingType === "SALE"
              ? "bg-amber-500 text-slate-950 shadow-md scale-[1.02]"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
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
              ? "bg-amber-500 text-slate-950 shadow-md scale-[1.02]"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Building className="h-4 w-4" />
          <span>رهن و اجاره</span>
        </button>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-center">

        <div className="relative sm:col-span-3">
          <label className="block text-[11px] font-bold text-slate-300 mb-1">
            شهر
          </label>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/90 px-3.5 py-3 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer pl-9"
            >
              <option value="">همه شهرها</option>
              {cities.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c}
                </option>
              ))}
            </select>
            <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="relative sm:col-span-3">
          <label className="block text-[11px] font-bold text-slate-300 mb-1">
            نوع کاربری
          </label>
          <div className="relative">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/90 px-3.5 py-3 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer pl-9"
            >
              <option value="">همه انواع ملک</option>
              <option value="APARTMENT" className="bg-slate-900 text-white">
                آپارتمان
              </option>
              <option value="VILLA" className="bg-slate-900 text-white">
                ویلا
              </option>
              <option value="LAND" className="bg-slate-900 text-white">
                زمین و کلنگی
              </option>
              <option value="OFFICE" className="bg-slate-900 text-white">
                اداری و شرکت
              </option>
              <option value="SHOP" className="bg-slate-900 text-white">
                مغازه و تجاری
              </option>
            </select>
            <Building className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="relative sm:col-span-4">
          <label className="block text-[11px] font-bold text-slate-300 mb-1">
            جستجوی نام محله یا کلیدواژه
          </label>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثلاً سعادت‌آباد، نیاوران، نوساز..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/90 pr-3 pl-9 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="sm:col-span-2 sm:self-end">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full h-11.5 font-bold shadow-lg"
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
