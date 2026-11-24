"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Scale,
  Check,
  Sparkles,
} from "lucide-react";
import { formatPrice, formatBedrooms, formatArea } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { useCompare } from "./CompareContext";
import type { PropertyItem } from "@/types";

export interface PropertyCardProps {
  property: PropertyItem;
  className?: string;
}

const PROPERTY_TYPE_TITLES: Record<string, string> = {
  APARTMENT: "آپارتمان",
  VILLA: "ویلا",
  LAND: "زمین",
  OFFICE: "اداری",
  SHOP: "تجاری",
};

export function PropertyCard({ property, className }: PropertyCardProps) {
  const { isInCompare, toggleCompare } = useCompare();
  const inCompare = isInCompare(property.id);

  const primaryImage =
    property.images && property.images.length > 0
      ? property.images[0].url
      : "/images/properties/prop-1.webp";

  const isSale = property.listingType === "SALE";
  const propertyTypeFa = PROPERTY_TYPE_TITLES[property.propertyType] || "ملک";

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl ${className || ""}`}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link href={`/properties/${property.slug}`} className="block h-full w-full">
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
        </Link>

        <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant={isSale ? "sale" : "rent"}
              className="shadow-sm backdrop-blur-xs font-semibold"
            >
              {isSale ? "فروش" : "رهن و اجاره"}
            </Badge>

            {property.featured && (
              <Badge
                variant="featured"
                className="shadow-sm backdrop-blur-xs flex items-center gap-1 font-bold text-white bg-blue-600 border-blue-500"
              >
                <Sparkles className="w-3 h-3 fill-white" />
                <span>ویژه</span>
              </Badge>
            )}
          </div>

          <span className="rounded-lg bg-slate-900/80 px-2 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-xs">
            {propertyTypeFa}
          </span>
        </div>

        <div className="absolute bottom-2.5 right-3 left-3 flex items-center gap-1 text-white text-xs font-medium drop-shadow-sm pointer-events-none">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-400" />
          <span className="truncate">
            {property.city}
            {property.district ? `، ${property.district}` : ""}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5 text-right">
        <h3 className="mb-2 line-clamp-1 text-base font-bold text-slate-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
          <Link href={`/properties/${property.slug}`} title={property.title}>
            {property.title}
          </Link>
        </h3>

        <div className="mb-4 grid grid-cols-3 gap-2 border-y border-slate-100 dark:border-slate-800/80 py-2.5 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 justify-start">
            <Maximize2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{formatArea(property.area)}</span>
          </div>

          <div className="flex items-center gap-1.5 justify-center">
            <Bed className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{formatBedrooms(property.bedrooms)}</span>
          </div>

          <div className="flex items-center gap-1.5 justify-end">
            <Bath className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{property.bathrooms} حمام</span>
          </div>
        </div>

        <div className="mt-auto mb-4">
          {isSale ? (
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-slate-400">قیمت کل:</span>
              <p className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white">
                {formatPrice(property.price)}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">ودیعه:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatPrice(property.deposit, "تومان", { fallbackToNegotiable: true })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">اجاره ماهانه:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(property.monthlyRent, "تومان", { fallbackToNegotiable: true })}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleCompare({
                id: property.id,
                title: property.title,
                listingType: property.listingType,
                price: property.price,
                deposit: property.deposit,
                monthlyRent: property.monthlyRent,
                image: primaryImage,
                city: property.city,
              });
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
              inCompare
                ? "bg-blue-600 text-white font-bold shadow-xs hover:bg-blue-700"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            {inCompare ? (
              <>
                <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                <span>در لیست مقایسه</span>
              </>
            ) : (
              <>
                <Scale className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>افزودن به مقایسه</span>
              </>
            )}
          </button>

          <Link
            href={`/properties/${property.slug}`}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1"
          >
            جزئیات
            <span>←</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs animate-pulse ${className}`}
    >
      <div className="relative aspect-16/10 w-full bg-slate-200/80 dark:bg-slate-800/80">
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="h-5 w-16 rounded-md bg-slate-300/80 dark:bg-slate-700/80" />
          <div className="h-5 w-12 rounded-md bg-slate-300/80 dark:bg-slate-700/80" />
        </div>
        <div className="absolute bottom-2.5 right-3 h-4 w-32 rounded bg-slate-300/80 dark:bg-slate-700/80" />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5 text-right space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-5/6 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/2 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
        </div>

        <div className="grid grid-cols-3 gap-2 border-y border-slate-100 dark:border-slate-800/80 py-3">
          <div className="h-4 rounded bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="h-4 rounded bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="h-4 rounded bg-slate-200/70 dark:bg-slate-800/70" />
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="h-3 w-16 rounded bg-slate-200/60 dark:bg-slate-800/60" />
          <div className="h-6 w-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="h-7 w-28 rounded-lg bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-4 w-12 rounded bg-slate-200/80 dark:bg-slate-800/80" />
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
