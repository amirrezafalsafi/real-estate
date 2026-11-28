"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Trash2,
  ExternalLink,
  Bed,
  Maximize2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatArea, toPersianDigits } from "@/lib/format";

interface FavoriteItemCardProps {
  favoriteId: string;
  property: {
    id: string;
    title: string;
    slug: string;
    city: string;
    district?: string | null;
    listingType: string;
    propertyType: string;
    price?: number | null;
    deposit?: number | null;
    monthlyRent?: number | null;
    area: number;
    bedrooms: number;
    images?: Array<{ url: string; order: number }>;
  };
}

export function FavoriteItemCard({ property }: FavoriteItemCardProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const res = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: property.id }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch {
    } finally {
      setIsRemoving(false);
    }
  };

  const isSale = property.listingType === "SALE";
  const primaryImage =
    property.images && property.images.length > 0
      ? property.images[0].url
      : "/images/properties/prop-1.webp";

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-4 flex flex-col justify-between transition-colors">
      <div className="space-y-3">
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
          <div className="absolute top-2.5 right-2.5">
            <Badge variant={isSale ? "sale" : "rent"} size="sm">
              {isSale ? "فروش" : "رهن و اجاره"}
            </Badge>
          </div>
        </div>

        <div className="space-y-1 text-right">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="truncate">
              {property.city}
              {property.district ? `، ${property.district}` : ""}
            </span>
          </div>

          <Link href={`/properties/${property.slug}`}>
            <h3 className="font-black text-slate-900 dark:text-white text-sm line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {property.title}
            </h3>
          </Link>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
            <span>{formatArea(property.area)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5 text-slate-400" />
            <span>{property.bedrooms === 0 ? "بدون خواب" : `${toPersianDigits(property.bedrooms)} خواب`}</span>
          </div>
        </div>

        <div className="text-right">
          {isSale ? (
            <p className="font-black text-blue-600 dark:text-blue-400 text-sm">
              {formatPrice(property.price)}
            </p>
          ) : (
            <div className="space-y-0.5 text-xs">
              <p className="text-slate-700 dark:text-slate-300">
                <span className="text-slate-400">ودیعه: </span>
                <span className="font-bold">{formatPrice(property.deposit)}</span>
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                <span className="text-slate-400">اجاره: </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formatPrice(property.monthlyRent)}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <Link
          href={`/properties/${property.slug}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>مشاهده آگهی</span>
        </Link>

        <button
          type="button"
          disabled={isRemoving}
          onClick={handleRemove}
          className="inline-flex items-center gap-1 rounded-xl p-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="حذف از نشان‌شده‌ها"
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
