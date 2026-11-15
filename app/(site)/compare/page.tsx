import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Scale,
  Check,
  X,
  Maximize2,
  Bed,
  Bath,
  Layers,
  Calendar,
  Building2,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  Crown,
} from "lucide-react";
import { getPropertiesByIds } from "@/server/services/property.service";
import prisma from "@/lib/prisma";
import { formatPrice, formatArea, formatBedrooms, toPersianDigits } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CompareShareButton } from "@/components/site/CompareShareButton";
import { CompareStudio, type ComparePreset } from "@/components/site/CompareStudio";
import type { PropertyItem } from "@/types";

export const metadata: Metadata = {
  title: "مقایسه تخصصی املاک | مسکن پلاس",
  description:
    "مقایسه دقیق قیمت، متراژ، طبقه، سال ساخت و امکانات املاک منتخب در مسکن پلاس برای تصمیم‌گیری آگاهانه‌تر.",
};

interface SearchParamsProps {
  ids?: string | string[];
}

const PROPERTY_TYPE_TITLES: Record<string, string> = {
  APARTMENT: "آپارتمان",
  VILLA: "ویلا",
  LAND: "زمین و کلنگی",
  OFFICE: "اداری",
  SHOP: "تجاری و مغازه",
};

async function CompareContent({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const { ids } = await searchParams;

  let idList: string[] = [];
  if (typeof ids === "string") {
    idList = ids
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (Array.isArray(ids)) {
    idList = ids
      .flatMap((s) => s.split(","))
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (idList.length < 2) {
    const studioProperties = await prisma.property.findMany({
      where: { status: "ACTIVE" },
      take: 12,
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    const presets: ComparePreset[] = [];
    if (studioProperties.length >= 2) {
      presets.push({
        id: "preset-1",
        title: "مقایسه دو آپارتمان مدرن پایتخت",
        description: "بررسی همزمان دو ملک لوکس در مناطق ممتاز تهران همراه با مقایسه متراژ و قیمت هر متر",
        propertyA: studioProperties[0] as unknown as PropertyItem,
        propertyB: studioProperties[1] as unknown as PropertyItem,
      });
    }
    if (studioProperties.length >= 4) {
      presets.push({
        id: "preset-2",
        title: "مقایسه ویلای لوکس و آپارتمان",
        description: "بررسی امکانات تفریحی، استخر و متراژ در مقایسه با واحد مسکونی",
        propertyA: studioProperties[2] as unknown as PropertyItem,
        propertyB: studioProperties[3] as unknown as PropertyItem,
      });
    }
    if (studioProperties.length >= 6) {
      presets.push({
        id: "preset-3",
        title: "مقایسه املاک اداری و تجاری",
        description: "بررسی گزینه‌های سرمایه‌گذاری ملکی و موقعیت تجاری در شهرهای مختلف",
        propertyA: studioProperties[4] as unknown as PropertyItem,
        propertyB: studioProperties[5] as unknown as PropertyItem,
      });
    }

    return (
      <CompareStudio
        initialProperties={studioProperties as unknown as PropertyItem[]}
        presets={presets}
      />
    );
  }

  const properties = await getPropertiesByIds(idList.slice(0, 2));

  if (properties.length < 2) {
    const studioProperties = await prisma.property.findMany({
      where: { status: "ACTIVE" },
      take: 12,
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    const presets: ComparePreset[] = [];
    if (studioProperties.length >= 2) {
      presets.push({
        id: "preset-1",
        title: "مقایسه دو آپارتمان مدرن پایتخت",
        description: "بررسی همزمان دو ملک لوکس در مناطق ممتاز تهران همراه با مقایسه متراژ و قیمت هر متر",
        propertyA: studioProperties[0] as unknown as PropertyItem,
        propertyB: studioProperties[1] as unknown as PropertyItem,
      });
    }
    if (studioProperties.length >= 4) {
      presets.push({
        id: "preset-2",
        title: "مقایسه ویلای لوکس و آپارتمان",
        description: "بررسی امکانات تفریحی، استخر و متراژ در مقایسه با واحد مسکونی",
        propertyA: studioProperties[2] as unknown as PropertyItem,
        propertyB: studioProperties[3] as unknown as PropertyItem,
      });
    }

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800 flex items-center justify-between">
          <span>شناسه‌های درخواستی در سامانه یافت نشدند یا از حالت فعال خارج شده‌اند. می‌توانید از بخش زیر املاک دیگری را برای مقایسه انتخاب کنید.</span>
          <Link href="/compare" className="underline text-rose-950 font-black">
            شروع مجدد
          </Link>
        </div>
        <CompareStudio
          initialProperties={studioProperties as unknown as PropertyItem[]}
          presets={presets}
        />
      </div>
    );
  }

  const propA = properties[0];
  const propB = properties[1];

  const pricePerMeterA =
    propA.listingType === "SALE" && propA.price && propA.area > 0
      ? Math.round(propA.price / propA.area)
      : null;
  const pricePerMeterB =
    propB.listingType === "SALE" && propB.price && propB.area > 0
      ? Math.round(propB.price / propB.area)
      : null;

  const areaWinner =
    propA.area > propB.area ? "A" : propB.area > propA.area ? "B" : "TIE";

  let priceWinner: "A" | "B" | "TIE" | "DIFF_TYPE" = "DIFF_TYPE";
  if (propA.listingType === "SALE" && propB.listingType === "SALE") {
    if (propA.price && propB.price) {
      priceWinner =
        propA.price < propB.price ? "A" : propB.price < propA.price ? "B" : "TIE";
    }
  } else if (propA.listingType === "RENT" && propB.listingType === "RENT") {
    const depA = propA.deposit || 0;
    const depB = propB.deposit || 0;
    priceWinner = depA < depB ? "A" : depB < depA ? "B" : "TIE";
  }

  let pricePerMeterWinner: "A" | "B" | "TIE" | null = null;
  if (pricePerMeterA && pricePerMeterB) {
    pricePerMeterWinner =
      pricePerMeterA < pricePerMeterB
        ? "A"
        : pricePerMeterB < pricePerMeterA
        ? "B"
        : "TIE";
  }

  const bedroomsWinner =
    propA.bedrooms > propB.bedrooms ? "A" : propB.bedrooms > propA.bedrooms ? "B" : "TIE";

  let yearWinner: "A" | "B" | "TIE" | null = null;
  if (propA.yearBuilt && propB.yearBuilt) {
    yearWinner =
      propA.yearBuilt > propB.yearBuilt ? "A" : propB.yearBuilt > propA.yearBuilt ? "B" : "TIE";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              خانه
            </Link>
            <ChevronLeft className="h-3 w-3 text-slate-400 dark:text-slate-500" />
            <Link href="/properties" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              املاک
            </Link>
            <ChevronLeft className="h-3 w-3 text-slate-400 dark:text-slate-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">مقایسه دو ملک</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl flex items-center gap-2">
            <Scale className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <span>جدول مقایسه تخصصی دو ملک</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            بررسی همزمان مشخصات، قیمت، متراژ و امکانات همراه با هایلایت ارزش برتر
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CompareShareButton />
          <Link href="/compare">
            <Button variant="outline" size="sm">
              استودیوی انتخاب و تغییر املاک
            </Button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md transition-colors">
        <table className="w-full min-w-[650px] border-collapse text-right">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80">
              <th className="w-1/4 p-4 text-xs font-bold text-slate-500 dark:text-slate-400">معیار مقایسه</th>
              <th className="w-3/8 p-4 text-right">
                <span className="rounded-md bg-blue-600/15 dark:bg-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-800 dark:text-blue-300">
                  ملک اول (الف)
                </span>
              </th>
              <th className="w-3/8 p-4 text-right">
                <span className="rounded-md bg-sky-500/15 dark:bg-sky-500/20 px-2 py-0.5 text-[11px] font-bold text-sky-900 dark:text-sky-300">
                  ملک دوم (ب)
                </span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            <tr className="bg-white dark:bg-slate-900">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300 align-top">تصویر و مشخصات کلی</td>

              <td className="p-4 align-top">
                <div className="space-y-3">
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src={
                        propA.images?.[0]?.url ||
                        "/images/properties/prop-1.webp"
                      }
                      alt={propA.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={propA.listingType === "SALE" ? "sale" : "rent"} size="sm">
                        {propA.listingType === "SALE" ? "فروش" : "رهن و اجاره"}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="line-clamp-2 text-base font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Link href={`/properties/${propA.slug}`}>{propA.title}</Link>
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {propA.city}
                      {propA.district ? `، ${propA.district}` : ""}
                    </p>
                  </div>
                </div>
              </td>

              <td className="p-4 align-top">
                <div className="space-y-3">
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={
                        propB.images?.[0]?.url ||
                        "/images/properties/prop-2.webp"
                      }
                      alt={propB.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={propB.listingType === "SALE" ? "sale" : "rent"} size="sm">
                        {propB.listingType === "SALE" ? "فروش" : "رهن و اجاره"}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="line-clamp-2 text-base font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Link href={`/properties/${propB.slug}`}>{propB.title}</Link>
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {propB.city}
                      {propB.district ? `، ${propB.district}` : ""}
                    </p>
                  </div>
                </div>
              </td>
            </tr>

            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span>نوع ملک</span>
              </td>
              <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                {PROPERTY_TYPE_TITLES[propA.propertyType] || propA.propertyType}
              </td>
              <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                {PROPERTY_TYPE_TITLES[propB.propertyType] || propB.propertyType}
              </td>
            </tr>

            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300">قیمت / شرایط مالی</td>

              <td
                className={`p-4 ${
                  priceWinner === "A" ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500" : ""
                }`}
              >
                {propA.listingType === "SALE" ? (
                  <div>
                    <span className="text-base font-black text-slate-950 dark:text-white">
                      {formatPrice(propA.price)}
                    </span>
                    {priceWinner === "A" && (
                      <span className="mr-2 inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                        <Crown className="h-3 w-3" />
                        قیمت مناسب‌تر
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">ودیعه: </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatPrice(propA.deposit, "تومان", { fallbackToNegotiable: true })}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">اجاره: </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(propA.monthlyRent, "تومان", { fallbackToNegotiable: true })}
                      </span>
                    </div>
                    {priceWinner === "A" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                        ودیعه کمتر
                      </span>
                    )}
                  </div>
                )}
              </td>

              <td
                className={`p-4 ${
                  priceWinner === "B" ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500" : ""
                }`}
              >
                {propB.listingType === "SALE" ? (
                  <div>
                    <span className="text-base font-black text-slate-950 dark:text-white">
                      {formatPrice(propB.price)}
                    </span>
                    {priceWinner === "B" && (
                      <span className="mr-2 inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                        <Crown className="h-3 w-3" />
                        قیمت مناسب‌تر
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">ودیعه: </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatPrice(propB.deposit, "تومان", { fallbackToNegotiable: true })}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">اجاره: </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(propB.monthlyRent, "تومان", { fallbackToNegotiable: true })}
                      </span>
                    </div>
                    {priceWinner === "B" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                        ودیعه کمتر
                      </span>
                    )}
                  </div>
                )}
              </td>
            </tr>

            {(pricePerMeterA || pricePerMeterB) && (
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">قیمت هر متر مربع</td>
                <td
                  className={`p-4 ${
                    pricePerMeterWinner === "A"
                      ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500 font-bold"
                      : ""
                  }`}
                >
                  {pricePerMeterA ? (
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{formatPrice(pricePerMeterA)}</span>
                      {pricePerMeterWinner === "A" && (
                        <span className="mr-2 inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                          ارزان‌تر
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">مربوط به فروش نیست</span>
                  )}
                </td>
                <td
                  className={`p-4 ${
                    pricePerMeterWinner === "B"
                      ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500 font-bold"
                      : ""
                  }`}
                >
                  {pricePerMeterB ? (
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{formatPrice(pricePerMeterB)}</span>
                      {pricePerMeterWinner === "B" && (
                        <span className="mr-2 inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                          ارزان‌تر
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">مربوط به فروش نیست</span>
                  )}
                </td>
              </tr>
            )}

            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span>متراژ زیربنا</span>
              </td>
              <td
                className={`p-4 ${
                  areaWinner === "A"
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500 font-black text-emerald-950 dark:text-emerald-200"
                    : "font-bold text-slate-900 dark:text-slate-100"
                }`}
              >
                <span>{formatArea(propA.area)}</span>
                {areaWinner === "A" && (
                  <span className="mr-2 inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                    متراژ بزرگ‌تر
                  </span>
                )}
              </td>
              <td
                className={`p-4 ${
                  areaWinner === "B"
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500 font-black text-emerald-950 dark:text-emerald-200"
                    : "font-bold text-slate-900 dark:text-slate-100"
                }`}
              >
                <span>{formatArea(propB.area)}</span>
                {areaWinner === "B" && (
                  <span className="mr-2 inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                    متراژ بزرگ‌تر
                  </span>
                )}
              </td>
            </tr>

            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Bed className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span>تعداد اتاق خواب</span>
              </td>
              <td
                className={`p-4 ${
                  bedroomsWinner === "A"
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500 font-bold"
                    : ""
                }`}
              >
                <span className="text-slate-900 dark:text-slate-100">{formatBedrooms(propA.bedrooms)}</span>
                {bedroomsWinner === "A" && (
                  <span className="mr-2 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                    خواب بیشتر
                  </span>
                )}
              </td>
              <td
                className={`p-4 ${
                  bedroomsWinner === "B"
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500 font-bold"
                    : ""
                }`}
              >
                <span className="text-slate-900 dark:text-slate-100">{formatBedrooms(propB.bedrooms)}</span>
                {bedroomsWinner === "B" && (
                  <span className="mr-2 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                    خواب بیشتر
                  </span>
                )}
              </td>
            </tr>

            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Bath className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span>سرویس بهداشتی / حمام</span>
              </td>
              <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                {toPersianDigits(propA.bathrooms)} سرویس
              </td>
              <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                {toPersianDigits(propB.bathrooms)} سرویس
              </td>
            </tr>

            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Layers className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span>طبقه</span>
              </td>
              <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                {propA.floor !== null && propA.floor !== undefined
                  ? propA.floor === 0
                    ? "همکف"
                    : `طبقه ${toPersianDigits(propA.floor)}`
                  : "مشخص نشده"}
              </td>
              <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                {propB.floor !== null && propB.floor !== undefined
                  ? propB.floor === 0
                    ? "همکف"
                    : `طبقه ${toPersianDigits(propB.floor)}`
                  : "مشخص نشده"}
              </td>
            </tr>

            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span>سال ساخت</span>
              </td>
              <td
                className={`p-4 ${
                  yearWinner === "A"
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500 font-bold"
                    : ""
                }`}
              >
                <span className="text-slate-900 dark:text-slate-100">{propA.yearBuilt ? `سال ${toPersianDigits(propA.yearBuilt)}` : "نوساز"}</span>
                {yearWinner === "A" && (
                  <span className="mr-2 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                    نوسازتر
                  </span>
                )}
              </td>
              <td
                className={`p-4 ${
                  yearWinner === "B"
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500 font-bold"
                    : ""
                }`}
              >
                <span className="text-slate-900 dark:text-slate-100">{propB.yearBuilt ? `سال ${toPersianDigits(propB.yearBuilt)}` : "نوساز"}</span>
                {yearWinner === "B" && (
                  <span className="mr-2 rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                    نوسازتر
                  </span>
                )}
              </td>
            </tr>

            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300">پارکینگ اختصاصی</td>
              <td
                className={`p-4 ${
                  propA.parking && !propB.parking
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500"
                    : ""
                }`}
              >
                {propA.parking ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>دارد</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-400">
                    <X className="h-4 w-4 text-slate-300" />
                    <span>ندارد</span>
                  </span>
                )}
              </td>
              <td
                className={`p-4 ${
                  propB.parking && !propA.parking
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500"
                    : ""
                }`}
              >
                {propB.parking ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>دارد</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                    <X className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    <span>ندارد</span>
                  </span>
                )}
              </td>
            </tr>

            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300">آسانسور</td>
              <td
                className={`p-4 ${
                  propA.elevator && !propB.elevator
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500"
                    : ""
                }`}
              >
                {propA.elevator ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>دارد</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                    <X className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    <span>ندارد</span>
                  </span>
                )}
              </td>
              <td
                className={`p-4 ${
                  propB.elevator && !propA.elevator
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500"
                    : ""
                }`}
              >
                {propB.elevator ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>دارد</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                    <X className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    <span>ندارد</span>
                  </span>
                )}
              </td>
            </tr>

            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300">انباری</td>
              <td
                className={`p-4 ${
                  propA.storage && !propB.storage
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500"
                    : ""
                }`}
              >
                {propA.storage ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>دارد</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                    <X className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    <span>ندارد</span>
                  </span>
                )}
              </td>
              <td
                className={`p-4 ${
                  propB.storage && !propA.storage
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500"
                    : ""
                }`}
              >
                {propB.storage ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>دارد</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                    <X className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    <span>ندارد</span>
                  </span>
                )}
              </td>
            </tr>

            <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300">بالکن / تراس</td>
              <td
                className={`p-4 ${
                  propA.balcony && !propB.balcony
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500"
                    : ""
                }`}
              >
                {propA.balcony ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>دارد</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                    <X className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    <span>ندارد</span>
                  </span>
                )}
              </td>
              <td
                className={`p-4 ${
                  propB.balcony && !propA.balcony
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-r-emerald-500"
                    : ""
                }`}
              >
                {propB.balcony ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>دارد</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                    <X className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    <span>ندارد</span>
                  </span>
                )}
              </td>
            </tr>

            <tr className="bg-slate-50/60 dark:bg-slate-800/60">
              <td className="p-4 font-bold text-slate-700 dark:text-slate-300">عملیات</td>
              <td className="p-4 space-y-2">
                <Link
                  href={`/properties/${propA.slug}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 py-2.5 px-4 text-xs font-bold text-white transition-colors w-full shadow-sm"
                >
                  <span>مشاهده صفحه کامل ملک الف</span>
                  <ExternalLink className="h-3.5 w-3.5 text-blue-200" />
                </Link>
                <Link
                  href={`/properties/${propA.slug}#visit-request`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 py-2 px-4 text-xs font-bold text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors w-full"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>درخواست بازدید ملک الف</span>
                </Link>
              </td>
              <td className="p-4 space-y-2">
                <Link
                  href={`/properties/${propB.slug}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 py-2.5 px-4 text-xs font-bold text-white transition-colors w-full shadow-sm"
                >
                  <span>مشاهده صفحه کامل ملک ب</span>
                  <ExternalLink className="h-3.5 w-3.5 text-blue-200" />
                </Link>
                <Link
                  href={`/properties/${propB.slug}#visit-request`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 py-2 px-4 text-xs font-bold text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors w-full"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>درخواست بازدید ملک ب</span>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CompareSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-right">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-80 rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-28 rounded-md bg-blue-600/20 dark:bg-blue-500/20" />
          <div className="h-6 w-28 rounded-md bg-sky-500/20 dark:bg-sky-500/20" />
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-3">
            <div className="aspect-16/10 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-1/3 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
          <div className="space-y-3">
            <div className="aspect-16/10 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-1/3 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-32 rounded bg-slate-100 dark:bg-slate-800/60" />
              <div className="h-4 w-32 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ComparePage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<CompareSkeleton />}>
        <CompareContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
