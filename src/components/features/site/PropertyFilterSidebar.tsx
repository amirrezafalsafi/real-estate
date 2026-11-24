"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Filter,
  X,
  RotateCcw,
  Search,
  Building,
  MapPin,
  Bed,
  CheckSquare,
  Square,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PropertyFilterSidebarProps {
  cities: string[];
}

export function PropertyFilterSidebar({ cities }: PropertyFilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [listingType, setListingType] = useState(searchParams.get("listingType") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minArea, setMinArea] = useState(searchParams.get("minArea") || "");
  const [maxArea, setMaxArea] = useState(searchParams.get("maxArea") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [parking, setParking] = useState(searchParams.get("parking") === "true");
  const [elevator, setElevator] = useState(searchParams.get("elevator") === "true");
  const [storage, setStorage] = useState(searchParams.get("storage") === "true");
  const [balcony, setBalcony] = useState(searchParams.get("balcony") === "true");

  const applyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) params.set("query", query.trim());
    if (listingType) params.set("listingType", listingType);
    if (propertyType) params.set("propertyType", propertyType);
    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minArea) params.set("minArea", minArea);
    if (maxArea) params.set("maxArea", maxArea);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (parking) params.set("parking", "true");
    if (elevator) params.set("elevator", "true");
    if (storage) params.set("storage", "true");
    if (balcony) params.set("balcony", "true");

    const currentSort = searchParams.get("sort");
    if (currentSort) params.set("sort", currentSort);

    router.push(`/properties?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setQuery("");
    setListingType("");
    setPropertyType("");
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setBedrooms("");
    setParking(false);
    setElevator(false);
    setStorage(false);
    setBalcony(false);

    router.push("/properties");
    setIsOpen(false);
  };

  const hasActiveFilters = Boolean(
    query ||
      listingType ||
      propertyType ||
      city ||
      minPrice ||
      maxPrice ||
      minArea ||
      maxArea ||
      bedrooms ||
      parking ||
      elevator ||
      storage ||
      balcony
  );

  const filterFormContent = (
    <form onSubmit={applyFilters} className="space-y-6 text-right">
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
          جستجوی متنی (عنوان یا آدرس)
        </label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مثلاً آپارتمان نوساز..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pr-9 pl-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
          نوع معامله
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setListingType("")}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              !listingType
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            همه
          </button>
          <button
            type="button"
            onClick={() => setListingType("SALE")}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              listingType === "SALE"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            فروش
          </button>
          <button
            type="button"
            onClick={() => setListingType("RENT")}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              listingType === "RENT"
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            رهن و اجاره
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
          نوع کاربری ملک
        </label>
        <div className="relative">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none cursor-pointer pl-8 transition-colors"
          >
            <option value="">همه کاربری‌ها</option>
            <option value="APARTMENT">آپارتمان</option>
            <option value="VILLA">ویلا</option>
            <option value="LAND">زمین و کلنگی</option>
            <option value="OFFICE">اداری</option>
            <option value="SHOP">تجاری</option>
          </select>
          <Building className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
          شهر
        </label>
        <div className="relative">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none cursor-pointer pl-8 transition-colors"
          >
            <option value="">همه شهرها</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <MapPin className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
          حداقل خواب
        </label>
        <div className="relative">
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none cursor-pointer pl-8 transition-colors"
          >
            <option value="">مهم نیست</option>
            <option value="1">۱ خواب به بالا</option>
            <option value="2">۲ خواب به بالا</option>
            <option value="3">۳ خواب به بالا</option>
            <option value="4">۴ خواب به بالا</option>
          </select>
          <Bed className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
          محدوده قیمت کل (تومان)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="حداقل قیمت"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="حداکثر قیمت"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
          محدوده متراژ (متر مربع)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
            placeholder="حداقل متراژ"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
          <input
            type="number"
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
            placeholder="حداکثر متراژ"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
          امکانات ضروری
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <button
              type="button"
              onClick={() => setParking(!parking)}
              className="text-blue-600"
            >
              {parking ? (
                <CheckSquare className="h-4 w-4 fill-blue-600 text-white" />
              ) : (
                <Square className="h-4 w-4 text-slate-300 dark:text-slate-600" />
              )}
            </button>
            <span>پارکینگ</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <button
              type="button"
              onClick={() => setElevator(!elevator)}
              className="text-blue-600"
            >
              {elevator ? (
                <CheckSquare className="h-4 w-4 fill-blue-600 text-white" />
              ) : (
                <Square className="h-4 w-4 text-slate-300 dark:text-slate-600" />
              )}
            </button>
            <span>آسانسور</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <button
              type="button"
              onClick={() => setStorage(!storage)}
              className="text-blue-600"
            >
              {storage ? (
                <CheckSquare className="h-4 w-4 fill-blue-600 text-white" />
              ) : (
                <Square className="h-4 w-4 text-slate-300 dark:text-slate-600" />
              )}
            </button>
            <span>انباری</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <button
              type="button"
              onClick={() => setBalcony(!balcony)}
              className="text-blue-600"
            >
              {balcony ? (
                <CheckSquare className="h-4 w-4 fill-blue-600 text-white" />
              ) : (
                <Square className="h-4 w-4 text-slate-300 dark:text-slate-600" />
              )}
            </button>
            <span>بالکن</span>
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full font-bold shadow-sm"
          rightIcon={<Filter className="h-4 w-4" />}
        >
          اعمال فیلترها
        </Button>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="w-full text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700"
            rightIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            پاک کردن تمام فیلترها
          </Button>
        )}
      </div>
    </form>
  );

  return (
    <>
      <div className="lg:hidden flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs"
        >
          <Filter className="h-4 w-4 text-white" />
          <span>فیلترهای پیشرفته</span>
          {hasActiveFilters && (
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>حذف فیلترها</span>
          </button>
        )}
      </div>

      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Layers className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">فیلترهای جستجو</h2>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                title="پاک کردن فیلترها"
                className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>حذف همه</span>
              </button>
            )}
          </div>

          {filterFormContent}
        </div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col p-6 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Filter className="h-4 w-4" />
                  </div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">فیلترهای پیشرفته</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {filterFormContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyFilterSidebar;
