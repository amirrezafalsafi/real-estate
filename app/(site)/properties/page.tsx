import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  getProperties,
  getFilterOptions,
} from "@/server/services/property.service";
import { PropertyCard } from "@/components/site/PropertyCard";
import { PropertyFilterSidebar } from "@/components/site/PropertyFilterSidebar";
import { PropertySortSelect } from "@/components/site/PropertySortSelect";
import { formatNumber, toPersianDigits } from "@/lib/format";
import type {
  PropertyItem,
  ListingType,
  PropertyType,
  PropertyStatus,
} from "@/types";
import type { PropertySortOption } from "@/lib/validations/property-filter.zod";
import { Filter, X, ChevronRight, ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "جستجو و فیلتر املاک | مسکن پلاس",
  description:
    "مشاهده و مقایسه انواع آگهی‌های کارشناسی شده خرید و فروش آپارتمان، رهن و اجاره خانه، ویلا، زمین و دفاتر اداری با فیلترهای پیشرفته قیمت، متراژ و امکانات.",
};

interface SearchParamsProps {
  listingType?: string;
  propertyType?: string;
  city?: string;
  district?: string;
  query?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  bedrooms?: string;
  parking?: string;
  elevator?: string;
  storage?: string;
  balcony?: string;
  sort?: string;
  page?: string;
}

const PROPERTY_TYPE_NAMES: Record<string, string> = {
  APARTMENT: "آپارتمان",
  VILLA: "ویلا",
  LAND: "زمین",
  OFFICE: "اداری",
  SHOP: "تجاری",
};

async function PropertiesContent({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const params = await searchParams;

  const filters = {
    listingType: params.listingType as ListingType | undefined,
    propertyType: params.propertyType as PropertyType | undefined,
    city: params.city,
    district: params.district,
    query: params.query || params.search,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minArea: params.minArea ? Number(params.minArea) : undefined,
    maxArea: params.maxArea ? Number(params.maxArea) : undefined,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    parking: params.parking === "true",
    elevator: params.elevator === "true",
    storage: params.storage === "true",
    balcony: params.balcony === "true",
    status: "ACTIVE" as PropertyStatus,
  };

  const pagination = {
    page: params.page ? Number(params.page) : 1,
    limit: 12,
  };

  const sort = (params.sort as PropertySortOption) || "newest";

  const [{ items, total, page, totalPages }, filterOptions] = await Promise.all([
    getProperties(filters, pagination, sort),
    getFilterOptions(),
  ]);

  const createParamUrl = (newParams: Record<string, string | undefined>) => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== "") urlParams.set(key, val);
    });
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined) {
        urlParams.delete(key);
      } else {
        urlParams.set(key, val);
      }
    });
    return `/properties?${urlParams.toString()}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start text-right">

      <PropertyFilterSidebar cities={filterOptions.cities} />

      <div className="flex-1 w-full space-y-6">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900">
              لیست آگهی‌های املاک
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              نمایش <span className="font-bold text-slate-900">{formatNumber(total)}</span> ملک منطبق با جستجو
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-400 font-medium">مرتب‌سازی:</span>
            <PropertySortSelect currentSort={sort} />
          </div>
        </div>

        {(params.listingType ||
          params.propertyType ||
          params.city ||
          params.query ||
          params.bedrooms ||
          params.parking ||
          params.elevator) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-bold">فیلترهای فعال:</span>

            {params.listingType && (
              <Link
                href={createParamUrl({ listingType: undefined, page: "1" })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-700 font-semibold"
              >
                <span>معامله: {params.listingType === "SALE" ? "فروش" : "رهن و اجاره"}</span>
                <X className="h-3 w-3 text-slate-400 hover:text-slate-700" />
              </Link>
            )}

            {params.propertyType && (
              <Link
                href={createParamUrl({ propertyType: undefined, page: "1" })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-700 font-semibold"
              >
                <span>کاربری: {PROPERTY_TYPE_NAMES[params.propertyType] || params.propertyType}</span>
                <X className="h-3 w-3 text-slate-400 hover:text-slate-700" />
              </Link>
            )}

            {params.city && (
              <Link
                href={createParamUrl({ city: undefined, page: "1" })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-700 font-semibold"
              >
                <span>شهر: {params.city}</span>
                <X className="h-3 w-3 text-slate-400 hover:text-slate-700" />
              </Link>
            )}

            {params.query && (
              <Link
                href={createParamUrl({ query: undefined, search: undefined, page: "1" })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-700 font-semibold"
              >
                <span>جستجو: «{params.query}»</span>
                <X className="h-3 w-3 text-slate-400 hover:text-slate-700" />
              </Link>
            )}

            {params.bedrooms && (
              <Link
                href={createParamUrl({ bedrooms: undefined, page: "1" })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-700 font-semibold"
              >
                <span>حداقل {toPersianDigits(params.bedrooms)} خواب</span>
                <X className="h-3 w-3 text-slate-400 hover:text-slate-700" />
              </Link>
            )}

            <Link
              href="/properties"
              className="text-xs font-bold text-rose-600 hover:underline mr-auto"
            >
              پاک کردن همه
            </Link>
          </div>
        )}

        {items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-5 shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Filter className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">
                هیچ ملکی با این مشخصات یافت نشد
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                ممکن است فیلترهای اعمال‌شده بیش از حد محدودکننده باشند. برای یافتن گزینه‌های بیشتر، فیلترها را حذف یا تغییر دهید.
              </p>
            </div>

            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all"
            >
              <span>حذف تمام فیلترها و مشاهده همه</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((property) => (
              <PropertyCard
                key={property.id}
                property={property as unknown as PropertyItem}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-8 border-t border-slate-200">

            {page > 1 ? (
              <Link
                href={createParamUrl({ page: String(page - 1) })}
                className="flex h-10 px-3 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors gap-1"
              >
                <ChevronRight className="h-4 w-4" />
                <span>قبلی</span>
              </Link>
            ) : null}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isCurrent = pageNum === page;
              return (
                <Link
                  key={pageNum}
                  href={createParamUrl({ page: String(pageNum) })}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-slate-900 text-white shadow-md scale-105"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {toPersianDigits(pageNum)}
                </Link>
              );
            })}

            {page < totalPages ? (
              <Link
                href={createParamUrl({ page: String(page + 1) })}
                className="flex h-10 px-3 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors gap-1"
              >
                <span>بعدی</span>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function PropertiesLoadingSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start text-right animate-pulse">

      <div className="hidden lg:block w-72 shrink-0 h-130 rounded-3xl bg-slate-200/80" />

      <div className="flex-1 w-full space-y-6">
        <div className="h-16 rounded-3xl bg-slate-200/80" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-200/80" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<PropertiesLoadingSkeleton />}>
        <PropertiesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
