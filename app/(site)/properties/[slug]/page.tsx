import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Layers,
  Calendar,
  Building2,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  FileText,
  Check,
  X,
  Phone,
  Car,
  ArrowUpDown,
  Archive,
  SunMedium,
  Compass,
  Clock,
} from "lucide-react";
import { getPropertyBySlug, getSimilarProperties } from "@/server/services/property.service";
import { formatPrice, formatArea, formatBedrooms, toPersianDigits } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { PropertyGallery } from "@/components/site/PropertyGallery";
import { PropertyCard } from "@/components/site/PropertyCard";
import { ConsultationForm } from "@/components/site/ConsultationForm";
import { PropertyDetailActions } from "@/components/site/PropertyDetailActions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PROPERTY_TYPE_TITLES: Record<string, string> = {
  APARTMENT: "آپارتمان",
  VILLA: "ویلا",
  LAND: "زمین و کلنگی",
  OFFICE: "اداری",
  SHOP: "تجاری و مغازه",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const property = await getPropertyBySlug(decodedSlug);

  if (!property) {
    return {
      title: "ملک یافت نشد | مسکن پلاس",
      description: "ملک مورد نظر در سامانه مسکن پلاس یافت نشد.",
    };
  }

  const primaryImage =
    property.images && property.images.length > 0
      ? property.images[0].url
      : "/images/properties/prop-1.webp";

  const isSale = property.listingType === "SALE";
  const priceInfo = isSale
    ? formatPrice(property.price)
    : `ودیعه: ${formatPrice(property.deposit)} | اجاره: ${formatPrice(property.monthlyRent)}`;

  const pageTitle = `${property.title} | مسکن پلاس`;
  const pageDescription = `${property.title} در شهر ${property.city}${
    property.district ? `، منطقه ${property.district}` : ""
  } - متراژ ${property.area} متر، ${property.bedrooms} خواب. ${priceInfo}. ${property.description.slice(
    0,
    140
  )}...`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "article",
      locale: "fa_IR",
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [primaryImage],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const property = await getPropertyBySlug(decodedSlug);

  if (!property) {
    notFound();
  }

  const similarProperties = await getSimilarProperties(
    property.id,
    property.city,
    property.propertyType,
    3
  );

  const isSale = property.listingType === "SALE";
  const propertyTypeFa = PROPERTY_TYPE_TITLES[property.propertyType] || "ملک";
  const pricePerMeter =
    isSale && property.price && property.area > 0
      ? Math.round(property.price / property.area)
      : null;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">

      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav aria-label="مسیر راهنما" className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              خانه
            </Link>
            <ChevronLeft className="h-3 w-3 text-slate-400" />
            <Link href="/properties" className="hover:text-slate-900 transition-colors">
              املاک
            </Link>
            <ChevronLeft className="h-3 w-3 text-slate-400" />
            <Link
              href={`/properties?city=${encodeURIComponent(property.city)}`}
              className="hover:text-slate-900 transition-colors"
            >
              {property.city}
            </Link>
            <ChevronLeft className="h-3 w-3 text-slate-400" />
            <span className="truncate max-w-[200px] sm:max-w-md font-medium text-slate-800">
              {property.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2.5">

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={isSale ? "sale" : "rent"} size="sm" className="font-bold">
                {isSale ? "خرید و فروش" : "رهن و اجاره"}
              </Badge>

              <span className="rounded-lg bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-white">
                {propertyTypeFa}
              </span>

              {property.featured && (
                <Badge
                  variant="featured"
                  size="sm"
                  className="flex items-center gap-1 font-bold"
                >
                  <Sparkles className="h-3 w-3 fill-blue-950 text-blue-950 dark:fill-blue-100 dark:text-blue-100" />
                  <span>آگهی ویژه</span>
                </Badge>
              )}

              <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {property.status === "ACTIVE" ? "آماده معامله" : property.status}
              </span>
            </div>

            <h1 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl lg:text-3xl leading-snug">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>
                  {property.city}
                  {property.district ? `، ${property.district}` : ""}
                  {property.address ? ` - ${property.address}` : ""}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  کد ملک:{" "}
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {property.id.slice(-6).toUpperCase()}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 pt-1">
            <PropertyDetailActions
              propertyId={property.id}
              title={property.title}
              price={property.price}
              deposit={property.deposit}
              monthlyRent={property.monthlyRent}
              listingType={property.listingType}
              image={property.images?.[0]?.url}
              city={property.city}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          <div className="space-y-8 lg:col-span-8">

            <PropertyGallery images={property.images || []} title={property.title} />

            <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-500/10 via-blue-50 to-blue-500/5 dark:from-blue-950/40 dark:via-slate-900 dark:to-blue-950/20 p-4 sm:p-6 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isSale ? "قیمت نهایی ملک:" : "شرایط اجاره ملک:"}
                  </span>
                  {isSale ? (
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                        {formatPrice(property.price)}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">ودیعه (رهن):</span>
                        <span className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                          {formatPrice(property.deposit, "تومان", { fallbackToNegotiable: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">اجاره ماهانه:</span>
                        <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
                          {formatPrice(property.monthlyRent, "تومان", {
                            fallbackToNegotiable: true,
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {isSale && pricePerMeter && (
                  <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-white/90 dark:bg-slate-800/90 px-4 py-2 text-left sm:text-right backdrop-blur-xs">
                    <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      قیمت هر متر مربع
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatPrice(pricePerMeter)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-colors">
              <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                <Compass className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>مشخصات اصلی ملک</span>
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100/80 dark:border-slate-800">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <Maximize2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">متراژ زیربنا</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {formatArea(property.area)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100/80 dark:border-slate-800">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                    <Bed className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">تعداد اتاق خواب</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {formatBedrooms(property.bedrooms)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100/80 dark:border-slate-800">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                    <Bath className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">سرویس بهداشتی / حمام</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {toPersianDigits(property.bathrooms)} سرویس
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100/80 dark:border-slate-800">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">طبقه واحد</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {property.floor !== null && property.floor !== undefined
                        ? property.floor === 0
                          ? "همکف"
                          : `طبقه ${toPersianDigits(property.floor)}`
                        : "مشخص نشده"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100/80 dark:border-slate-800">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">سال ساخت</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {property.yearBuilt ? `سال ${toPersianDigits(property.yearBuilt)}` : "نوساز"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100/80 dark:border-slate-800">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">نوع کاربری</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{propertyTypeFa}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-colors">
              <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>امکانات و ویژگی‌ها</span>
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div
                  className={`flex items-center justify-between rounded-2xl p-3.5 border transition-all ${
                    property.parking
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-900 dark:text-slate-100"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Car
                      className={`h-5 w-5 ${
                        property.parking ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <span className="text-xs font-bold">پارکینگ</span>
                  </div>
                  {property.parking ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
                      <X className="h-3 w-3" />
                    </span>
                  )}
                </div>

                <div
                  className={`flex items-center justify-between rounded-2xl p-3.5 border transition-all ${
                    property.elevator
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-900 dark:text-slate-100"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ArrowUpDown
                      className={`h-5 w-5 ${
                        property.elevator ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <span className="text-xs font-bold">آسانسور</span>
                  </div>
                  {property.elevator ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
                      <X className="h-3 w-3" />
                    </span>
                  )}
                </div>

                <div
                  className={`flex items-center justify-between rounded-2xl p-3.5 border transition-all ${
                    property.storage
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-900 dark:text-slate-100"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Archive
                      className={`h-5 w-5 ${
                        property.storage ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <span className="text-xs font-bold">انباری</span>
                  </div>
                  {property.storage ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
                      <X className="h-3 w-3" />
                    </span>
                  )}
                </div>

                <div
                  className={`flex items-center justify-between rounded-2xl p-3.5 border transition-all ${
                    property.balcony
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-900 dark:text-slate-100"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <SunMedium
                      className={`h-5 w-5 ${
                        property.balcony ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <span className="text-xs font-bold">بالکن / تراس</span>
                  </div>
                  {property.balcony ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
                      <X className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-colors">
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>توضیحات و جزئیات تکمیلی ملک</span>
              </h2>

              <div className="prose prose-slate dark:prose-invert max-w-none text-right">
                <p className="whitespace-pre-line text-sm leading-8 text-slate-700 dark:text-slate-300 sm:text-base">
                  {property.description}
                </p>
              </div>

              <div className="mt-8 flex items-start gap-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 p-4 transition-colors">
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <p className="font-bold">تضمین اصالت آگهی توسط مسکن پلاس</p>
                  <p className="leading-relaxed text-blue-800/90 dark:text-blue-300/80">
                    کلیه اطلاعات این ملک، مشخصات سند، کاربری و مدارک حقوقی توسط تیم کارشناسان
                    مسکن پلاس بازبینی و راستی‌آزمایی شده است.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6 lg:col-span-4">

            <div className="sticky top-24 space-y-6">

              <div
                id="visit-request"
                className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg transition-colors"
              >
                <div className="mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <span className="inline-block rounded-lg bg-blue-100 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-bold text-blue-900 dark:text-blue-300 mb-2">
                    مشاوره و بازدید رایگان
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    درخواست بازدید یا هماهنگی این ملک
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    برای بازدید حضوری یا کسب اطلاعات حقوقی و قیمت، فرم زیر را تکمیل کنید.
                  </p>
                </div>

                <ConsultationForm
                  propertyId={property.id}
                  compact={true}
                  submitText="ثبت درخواست هماهنگی و بازدید"
                  placeholderMessage="روز و ساعت مدنظرتان برای بازدید، یا سوالات خود درباره این ملک را بنویسید..."
                />

                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5 text-center">
                  <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    نیاز به راهنمایی فوری دارید؟
                  </span>
                  <a
                    href="tel:02188889999"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>تماس مستقیم با کارشناس: ۰۲۱-۸۸۸۸۹۹۹۹</span>
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs text-xs text-slate-600 dark:text-slate-400 space-y-3 transition-colors">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>توصیه‌های امنیتی مسکن پلاس</span>
                </div>
                <ul className="space-y-2 list-disc list-inside text-slate-500 dark:text-slate-400 leading-relaxed pr-1">
                  <li>قبل از هرگونه پرداخت وجه، حتماً از ملک به صورت حضوری بازدید فرمایید.</li>
                  <li>کلیه قراردادها با کدرهگیری رسمی و با حضور وکیل حقوقی امضا می‌شوند.</li>
                  <li>هیچ هزینه‌ای بابت بازدید اولیه دریافت نمی‌شود.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {similarProperties.length > 0 && (
          <section className="mt-16 border-t border-slate-200/80 dark:border-slate-800 pt-12">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">پیشنهادهای مرتبط</span>
                <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                  املاک مشابه در {property.city}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  سایر املاک ثبت‌شده با کاربری {propertyTypeFa} یا موقعیت مکانی مشابه
                </p>
              </div>

              <Link
                href={`/properties?city=${encodeURIComponent(property.city)}&propertyType=${
                  property.propertyType
                }`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>مشاهده همه املاک مشابه</span>
                <ChevronLeft className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarProperties.map((similar) => (
                <PropertyCard key={similar.id} property={similar} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
