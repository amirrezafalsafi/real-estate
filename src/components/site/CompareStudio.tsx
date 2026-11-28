"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Scale,
  Plus,
  Search,
  X,
  Sparkles,
  CheckCircle2,
  Trash2,
  Layers,
  ChevronLeft,
  ArrowLeftRight,
} from "lucide-react";
import { useCompare, type CompareItem } from "./CompareContext";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { PropertyItem } from "@/types";

export interface ComparePreset {
  id: string;
  title: string;
  description: string;
  propertyA: PropertyItem;
  propertyB: PropertyItem;
}

interface CompareStudioProps {
  initialProperties: PropertyItem[];
  presets: ComparePreset[];
}

export function CompareStudio({ initialProperties, presets }: CompareStudioProps) {
  const router = useRouter();
  const {
    compareItems,
    compareIds,
    addToCompare,
    removeFromCompare,
    clearCompare,
  } = useCompare();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState<0 | 1>(0);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerFilterCity, setPickerFilterCity] = useState<string>("ALL");

  const availableCities = Array.from(
    new Set(initialProperties.map((p) => p.city))
  ).filter(Boolean);

  const filteredPickerProps = initialProperties.filter((p) => {
    const matchesSearch =
      !pickerSearch.trim() ||
      p.title.includes(pickerSearch.trim()) ||
      p.city.includes(pickerSearch.trim()) ||
      (p.district && p.district.includes(pickerSearch.trim()));

    const matchesCity =
      pickerFilterCity === "ALL" || p.city === pickerFilterCity;

    return matchesSearch && matchesCity;
  });

  const slotA = compareItems[0] || null;
  const slotB = compareItems[1] || null;
  const isReady = compareItems.length === 2;
  const compareUrl = `/compare?ids=${compareIds.join(",")}`;

  const handleOpenPicker = (slotIndex: 0 | 1) => {
    setTargetSlot(slotIndex);
    setPickerSearch("");
    setIsPickerOpen(true);
  };

  const handleSelectPropertyForSlot = (property: PropertyItem) => {
    const compareItem: CompareItem = {
      id: property.id,
      title: property.title,
      listingType: property.listingType,
      price: property.price,
      deposit: property.deposit,
      monthlyRent: property.monthlyRent,
      image:
        property.images?.[0]?.url ||
        "/images/properties/prop-1.webp",
      city: property.city,
    };

    if (targetSlot === 0) {
      if (slotA && slotA.id !== property.id) {
        removeFromCompare(slotA.id);
      }
      addToCompare(compareItem);
    } else {
      if (slotB && slotB.id !== property.id) {
        removeFromCompare(slotB.id);
      }
      addToCompare(compareItem);
    }

    setIsPickerOpen(false);
  };

  const handleLoadPreset = (preset: ComparePreset) => {
    clearCompare();
    const itemA: CompareItem = {
      id: preset.propertyA.id,
      title: preset.propertyA.title,
      listingType: preset.propertyA.listingType,
      price: preset.propertyA.price,
      deposit: preset.propertyA.deposit,
      monthlyRent: preset.propertyA.monthlyRent,
      image: preset.propertyA.images?.[0]?.url,
      city: preset.propertyA.city,
    };
    const itemB: CompareItem = {
      id: preset.propertyB.id,
      title: preset.propertyB.title,
      listingType: preset.propertyB.listingType,
      price: preset.propertyB.price,
      deposit: preset.propertyB.deposit,
      monthlyRent: preset.propertyB.monthlyRent,
      image: preset.propertyB.images?.[0]?.url,
      city: preset.propertyB.city,
    };

    addToCompare(itemA);
    addToCompare(itemB);

    router.push(`/compare?ids=${preset.propertyA.id},${preset.propertyB.id}`);
  };

  return (
    <div className="space-y-12">

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 dark:bg-blue-500/15 px-4 py-1.5 text-xs font-black text-blue-700 dark:text-blue-300 border border-blue-500/20">
          <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>استودیوی مقایسه هوشمند سرپناه</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          مقایسه تخصصی و همزمان املاک
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          ۲ ملک را انتخاب کنید تا متراژ، قیمت کل و قیمت هر متر مربع، امکانات رفاهی و موقعیت جغرافیایی آن‌ها را در یک جدول مقایسه‌ای کامل بررسی فرمایید.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">

          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-blue-900 dark:text-blue-200 bg-blue-500/15 dark:bg-blue-500/20 px-3 py-1 rounded-lg">
                جایگاه ملک اول (الف)
              </span>
              {slotA && (
                <button
                  type="button"
                  onClick={() => removeFromCompare(slotA.id)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>حذف ملک</span>
                </button>
              )}
            </div>

            {slotA ? (
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 transition-all hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md">
                <div className="flex gap-4 items-center">
                  <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-700">
                    <Image
                      src={
                        slotA.image ||
                        "/images/properties/prop-1.webp"
                      }
                      alt={slotA.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5">
                      <Badge variant={slotA.listingType === "SALE" ? "sale" : "rent"} size="sm">
                        {slotA.listingType === "SALE" ? "فروش" : "رهن/اجاره"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-right space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
                      {slotA.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">شهر {slotA.city}</p>
                    <p className="text-xs font-black text-blue-600 dark:text-blue-400">
                      {slotA.listingType === "RENT"
                        ? formatPrice(slotA.deposit, "تومان", { fallbackToNegotiable: true })
                        : formatPrice(slotA.price, "تومان", { fallbackToNegotiable: true })}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    آماده مقایسه
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenPicker(0)}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    تغییر این ملک
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenPicker(0)}
                className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all flex flex-col items-center justify-center gap-3 p-6 text-center group cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    انتخاب ملک اول برای مقایسه
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    برای انتخاب کلیک فرمایید
                  </p>
                </div>
              </button>
            )}
          </div>

          <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 lg:py-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-800 text-blue-400 shadow-md ring-4 ring-slate-100 dark:ring-slate-700">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-1.5 uppercase tracking-wider">
              VS
            </span>
          </div>

          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-sky-900 dark:text-sky-200 bg-sky-500/15 dark:bg-sky-500/20 px-3 py-1 rounded-lg">
                جایگاه ملک دوم (ب)
              </span>
              {slotB && (
                <button
                  type="button"
                  onClick={() => removeFromCompare(slotB.id)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>حذف ملک</span>
                </button>
              )}
            </div>

            {slotB ? (
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 transition-all hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-md">
                <div className="flex gap-4 items-center">
                  <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-700">
                    <Image
                      src={
                        slotB.image ||
                        "/images/properties/prop-1.webp"
                      }
                      alt={slotB.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5">
                      <Badge variant={slotB.listingType === "SALE" ? "sale" : "rent"} size="sm">
                        {slotB.listingType === "SALE" ? "فروش" : "رهن/اجاره"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-right space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
                      {slotB.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">شهر {slotB.city}</p>
                    <p className="text-xs font-black text-sky-900 dark:text-sky-300">
                      {slotB.listingType === "RENT"
                        ? formatPrice(slotB.deposit, "تومان", { fallbackToNegotiable: true })
                        : formatPrice(slotB.price, "تومان", { fallbackToNegotiable: true })}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    آماده مقایسه
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenPicker(1)}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    تغییر این ملک
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenPicker(1)}
                className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-sky-50/20 dark:hover:bg-sky-950/20 transition-all flex flex-col items-center justify-center gap-3 p-6 text-center group cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-900 dark:group-hover:text-sky-300">
                    انتخاب ملک دوم برای مقایسه
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    برای انتخاب کلیک فرمایید
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isReady ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                هر دو ملک با موفقیت انتخاب شده‌اند. برای مشاهده جدول مقایسه روی دکمه مقابل کلیک فرمایید.
              </span>
            ) : compareItems.length === 1 ? (
              <span className="text-blue-700 dark:text-blue-300 font-bold">
                یک ملک انتخاب شده است — لطفاً دومین ملک را جهت فعال‌سازی جدول مقایسه انتخاب کنید.
              </span>
            ) : (
              <span className="text-slate-600 dark:text-slate-400">
                می‌توانید املاک مورد نظر خود را از کادرهای بالا یا از گزینه‌های آماده زیر انتخاب کنید.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {compareItems.length > 0 && (
              <Button
                variant="ghost"
                size="md"
                onClick={clearCompare}
                className="text-slate-500 hover:text-rose-600 text-xs font-bold"
              >
                پاک کردن همه
              </Button>
            )}

            {isReady ? (
              <Link href={compareUrl} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto font-black text-sm px-8 shadow-lg shadow-blue-500/25 animate-bounce-subtle"
                  rightIcon={<Scale className="h-4 w-4" />}
                >
                  مشاهده جدول مقایسه تخصصی ۲ ملک
                </Button>
              </Link>
            ) : (
              <Link href="/properties" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto text-xs font-bold">
                  جستجوی سایر املاک
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {presets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>مقایسه‌های پیشنهادی و محبوب</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                نمونه‌های آماده برای بررسی همزمان و مشاهده سریع جدول مقایسه با ۱ کلیک
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <h3 className="font-black text-slate-900 dark:text-white text-sm line-clamp-1">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={
                          preset.propertyA.images?.[0]?.url ||
                          "/images/properties/prop-1.webp"
                        }
                        alt={preset.propertyA.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute bottom-1 right-1 rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {preset.propertyA.city}
                      </span>
                    </div>

                    <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={
                          preset.propertyB.images?.[0]?.url ||
                          "/images/properties/prop-1.webp"
                        }
                        alt={preset.propertyB.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute bottom-1 right-1 rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {preset.propertyB.city}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLoadPreset(preset)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs hover:shadow"
                >
                  <Scale className="h-3.5 w-3.5 text-blue-200" />
                  <span>مشاهده مقایسه این دو ملک</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>انتخاب مستقیم از املاک منتخب</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              روی دکمه «افزودن به مقایسه» در هر کارت کلیک کنید تا در جایگاه‌های خالی قرار گیرد
            </p>
          </div>
          <Link
            href="/properties"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>مشاهده همه املاک</span>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialProperties.slice(0, 6).map((property) => {
            const inCompare = compareIds.includes(property.id);

            return (
              <div
                key={property.id}
                className={`overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 p-3.5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between ${
                  inCompare ? "border-blue-600 ring-2 ring-blue-500/20" : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="space-y-3">
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={
                        property.images?.[0]?.url ||
                        "/images/properties/prop-1.webp"
                      }
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={property.listingType === "SALE" ? "sale" : "rent"} size="sm">
                        {property.listingType === "SALE" ? "فروش" : "رهن و اجاره"}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      شهر {property.city} • {toPersianDigits(property.area)} متر
                    </p>
                    <p className="text-xs font-black text-blue-600 dark:text-blue-400 mt-1">
                      {property.listingType === "RENT"
                        ? formatPrice(property.deposit, "تومان", { fallbackToNegotiable: true })
                        : formatPrice(property.price, "تومان", { fallbackToNegotiable: true })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    href={`/properties/${property.slug}`}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    جزئیات ملک
                  </Link>

                  {inCompare ? (
                    <button
                      type="button"
                      onClick={() => removeFromCompare(property.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 hover:border-rose-200 dark:hover:border-rose-800 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>در مقایسه (حذف)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        addToCompare({
                          id: property.id,
                          title: property.title,
                          listingType: property.listingType,
                          price: property.price,
                          deposit: property.deposit,
                          monthlyRent: property.monthlyRent,
                          image: property.images?.[0]?.url,
                          city: property.city,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition-colors shadow-xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>افزودن به مقایسه</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-6 sm:p-8 transition-colors">
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-4">
          مزایای جدول مقایسه تخصصی سرپناه
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <div className="space-y-1.5">
            <span className="font-black text-slate-900 dark:text-white block">محاسبه قیمت هر متر مربع</span>
            <p className="leading-relaxed">
              ارزش واقعی هر ملک را بر اساس متراژ دقیق به تومان مقایسه کنید تا انتخاب اقتصادی‌تری داشته باشید.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="font-black text-slate-900 dark:text-white block">بررسی یک‌جای مشاعات و امکانات</span>
            <p className="leading-relaxed">
              پارکینگ سندی، آسانسور، انباری و بالکن را در کنار تعداد خواب‌ها بدون ورق زدن صفحات مکرر بررسی نمایید.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="font-black text-slate-900 dark:text-white block">هایلایت هوشمند ارزش برتر</span>
            <p className="leading-relaxed">
              سیستم به صورت خودکار ویژگی‌های برتر (مانند سن بنای کمتر، قیمت مناسب‌تر یا متراژ بالاتر) را نشان‌دار می‌کند.
            </p>
          </div>
        </div>
      </div>

      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl flex flex-col text-right border border-slate-200 dark:border-slate-800 transition-colors">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    انتخاب ملک برای {targetSlot === 0 ? "جایگاه اول (الف)" : "جایگاه دوم (ب)"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ملک مورد نظر خود را جستجو یا از لیست زیر انتخاب فرمایید
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="relative">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="جستجو در عنوان، شهر یا منطقه..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 pr-10 pl-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPickerFilterCity("ALL")}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    pickerFilterCity === "ALL"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  همه شهرها
                </button>
                {availableCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPickerFilterCity(c)}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap ${
                      pickerFilterCity === c
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 pl-1">
              {filteredPickerProps.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  ملکی با این مشخصات یافت نشد. لطفاً عبارت دیگری را جستجو فرمایید.
                </div>
              ) : (
                filteredPickerProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={
                            prop.images?.[0]?.url ||
                            "/images/properties/prop-1.webp"
                          }
                          alt={prop.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 text-right space-y-0.5">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {prop.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {prop.city} • {toPersianDigits(prop.area)} متر • {prop.bedrooms} خواب
                        </p>
                        <p className="text-xs font-black text-blue-600 dark:text-blue-400">
                          {prop.listingType === "RENT"
                            ? formatPrice(prop.deposit, "تومان", { fallbackToNegotiable: true })
                            : formatPrice(prop.price, "تومان", { fallbackToNegotiable: true })}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSelectPropertyForSlot(prop)}
                      className="shrink-0 text-xs font-bold"
                    >
                      انتخاب این ملک
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
