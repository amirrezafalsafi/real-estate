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
      className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl ${className || ""}`}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <Link href={`/properties/${property.slug}`} className="block h-full w-full">
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />
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
                className="shadow-sm backdrop-blur-xs flex items-center gap-1 font-bold text-amber-900 bg-amber-400 border-amber-500"
              >
                <Sparkles className="w-3 h-3 fill-amber-900" />
                <span>ویژه</span>
              </Badge>
            )}
          </div>

          <span className="rounded-lg bg-slate-900/80 px-2 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-xs">
            {propertyTypeFa}
          </span>
        </div>

        <div className="absolute bottom-2.5 right-3 left-3 flex items-center gap-1 text-white text-xs font-medium drop-shadow-sm pointer-events-none">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-400" />
          <span className="truncate">
            {property.city}
            {property.district ? `، ${property.district}` : ""}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5 text-right">

        <h3 className="mb-2 line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-amber-600">
          <Link href={`/properties/${property.slug}`} title={property.title}>
            {property.title}
          </Link>
        </h3>

        <div className="mb-4 grid grid-cols-3 gap-2 border-y border-slate-100 py-2.5 text-xs text-slate-600">
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
              <p className="text-base sm:text-lg font-extrabold text-slate-950">
                {formatPrice(property.price)}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">ودیعه:</span>
                <span className="font-bold text-slate-900">
                  {formatPrice(property.deposit, "تومان", { fallbackToNegotiable: true })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">اجاره ماهانه:</span>
                <span className="font-bold text-amber-600">
                  {formatPrice(property.monthlyRent, "تومان", { fallbackToNegotiable: true })}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
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
                ? "bg-amber-500 text-slate-950 font-bold shadow-xs hover:bg-amber-400"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            {inCompare ? (
              <>
                <Check className="h-3.5 w-3.5 text-slate-950 stroke-[3]" />
                <span>در لیست مقایسه</span>
              </>
            ) : (
              <>
                <Scale className="h-3.5 w-3.5 text-slate-500" />
                <span>افزودن به مقایسه</span>
              </>
            )}
          </button>

          <Link
            href={`/properties/${property.slug}`}
            className="text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors inline-flex items-center gap-1"
          >
            جزئیات
            <span className="text-amber-500">←</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
