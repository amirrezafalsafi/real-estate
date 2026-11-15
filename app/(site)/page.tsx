import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Scale,
  Building2,
  Home,
  Trees,
  Briefcase,
  PhoneCall,
  PlusCircle,
  Users,
  Award,
  ChevronLeft,
} from "lucide-react";
import {
  getFeaturedProperties,
  getFilterOptions,
  getCategoryCounts,
} from "@/server/services/property.service";
import { PropertyCard } from "@/components/site/PropertyCard";
import { HeroSearchForm } from "@/components/site/HeroSearchForm";
import { ConsultationForm } from "@/components/site/ConsultationForm";
import { formatNumber, toPersianDigits } from "@/lib/format";
import type { PropertyItem } from "@/types";

export const metadata: Metadata = {
  title: "مسکن پلاس | سامانه جامع خرید، فروش، رهن و اجاره ملک در ایران",
  description:
    "جامع‌ترین سامانه تخصصی معاملات ملکی کشور. جستجو، بررسی و مقایسه هزاران آگهی کارشناسی شده خرید و فروش آپارتمان، رهن و اجاره خانه، ویلاهای لوکس، زمین و املاک اداری و تجاری با مشاوره حقوقی رایگان.",
  keywords: [
    "املاک",
    "خرید ملک",
    "فروش آپارتمان",
    "رهن و اجاره",
    "اجاره خانه",
    "ویلا شمال",
    "املاک تهران",
    "خرید زمین",
    "دفتر کار",
    "مشاور املاک آنلاین",
  ],
  authors: [{ name: "مسکن پلاس" }],
  creator: "مسکن پلاس",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "مسکن پلاس | سامانه جامع خرید، فروش، رهن و اجاره ملک در ایران",
    description:
      "جستجو و معامله امن در بزرگترین بانک اطلاعاتی املاک کارشناسی شده در ایران به همراه کارشناسی قیمت و همراهی وکلای رسمی.",
    url: "/",
    siteName: "مسکن پلاس",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/images/properties/prop-1.webp",
        width: 1200,
        height: 630,
        alt: "مسکن پلاس - سامانه تخصصی املاک",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مسکن پلاس | سامانه جامع خرید و اجاره ملک",
    description: "بزرگترین سامانه تخصصی املاک و مستغلات با صدها ملک کارشناسی شده.",
    images: [
      "/images/properties/prop-1.webp",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function HomePage() {
  const [featuredProperties, filterOptions, categoryCounts] = await Promise.all([
    getFeaturedProperties(6),
    getFilterOptions(),
    getCategoryCounts(),
  ]);

  const categories = [
    {
      title: "آپارتمان و پنت‌هاوس",
      slug: "APARTMENT",
      icon: Building2,
      count: categoryCounts.apartment,
      description: "واحدهای نوساز، بازسازی‌شده و پنت‌هاوس‌های مجلل",
      image: "/images/properties/prop-1.webp",
    },
    {
      title: "ویلاهای لوکس و اختصاصی",
      slug: "VILLA",
      icon: Home,
      count: categoryCounts.villa,
      description: "ویلاهای ساحلی، جنگلی و استخردار با متریال عالی",
      image: "/images/properties/prop-7.webp",
    },
    {
      title: "زمین و کلنگی",
      slug: "LAND",
      icon: Trees,
      count: categoryCounts.land,
      description: "قطعات مسکونی سنددار، باغ و با کاربری ساخت‌وساز",
      image: "/images/properties/prop-15.webp",
    },
    {
      title: "املاک اداری و تجاری",
      slug: "OFFICE",
      icon: Briefcase,
      count: categoryCounts.commercial,
      description: "دفاتر کار موقعیت اداری، مغازه و مجتمع‌های تجاری",
      image: "/images/properties/prop-13.webp",
    },
  ];

  const benefits = [
    {
      icon: ShieldCheck,
      title: "استعلام ثبتی و اصالت اسناد",
      description:
        "تمامی آگهی‌ها قبل از انتشار توسط کارشناسان حقوقی مسکن پلاس از نظر اسناد مالکیت و پروانه ساخت به دقت راستی‌آزمایی می‌شوند.",
    },
    {
      icon: CheckCircle2,
      title: "کارشناسی فنی و قیمت منصفانه",
      description:
        "عکس‌برداری و فیلم‌برداری واقعی از واحدها به همراه ارزیابی دقیق قیمت روز بازار برای جلوگیری از خرید با قیمت‌های حباب‌دار.",
    },
    {
      icon: Scale,
      title: "کمیسیون شفاف و قانونی",
      description:
        "محاسبه کارمزد معاملات به صورت ۱۰۰٪ دقیق بر مبنای نرخ مصوب اتحادیه مشاوران املاک بدون دریافت هیچ‌گونه هزینه مازاد یا پنهان.",
    },
    {
      icon: Award,
      title: "شبکه گسترده فایل‌های شخصی",
      description:
        "دسترسی مستقیم و انحصاری به فایل‌های دست اول مالکان محترم در بهترین مناطق کلان‌شهرهای ایران بدون واسطه‌های غیرضروری.",
    },
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32 text-white">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/properties/prop-2.webp"
            alt="خانه رویایی مسکن پلاس"
            fill
            priority
            className="object-cover object-center brightness-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />
        </div>

        <div className="pointer-events-none absolute -top-40 right-1/4 -z-10 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-1.5 text-xs font-bold text-amber-400 shadow-lg backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>بزرگترین سامانه معاملات هوشمند و کارشناسی شده املاک</span>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
              مطمئن‌ترین مسیر برای یافتن{" "}
              <span className="text-amber-400 underline decoration-amber-500/40 underline-offset-8">
                ملک رویایی شما
              </span>
            </h1>
            <p className="text-base text-slate-300 sm:text-lg max-w-2xl mx-auto leading-relaxed">
              خرید، فروش و رهن و اجاره انواع آپارتمان، ویلا، زمین و املاک تجاری با همراهی کارشناسان متخصص و وکلای حقوقی در سراسر کشور.
            </p>
          </div>

          <div className="pt-2">
            <HeroSearchForm cities={filterOptions.cities} />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-5 text-right">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600">
              <Sparkles className="h-4 w-4" />
              <span>فرصت‌های ویژه سرمایه‌گذاری و سکونت</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              املاک ویژه و برگزیده
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              مجموعه‌ای از لوکس‌ترین و خوش‌قیمت‌ترین املاک کارشناسی شده توسط مشاوران مسکن پلاس
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-400 transition-colors"
          >
            <span>مشاهده همه املاک</span>
            <ArrowLeft className="h-4 w-4 text-amber-500" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property as unknown as PropertyItem}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-100/80 py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            <div className="space-y-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-950">
                {formatNumber(categoryCounts.total)}+
              </p>
              <p className="text-xs font-bold text-slate-500">ملک فعال و تایید شده</p>
            </div>

            <div className="space-y-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-950">
                {formatNumber(1450)}+
              </p>
              <p className="text-xs font-bold text-slate-500">خریدار و مستاجر راضی</p>
            </div>

            <div className="space-y-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Award className="h-5 w-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600">
                {formatNumber(580)}+
              </p>
              <p className="text-xs font-bold text-slate-500">قرارداد موفق سال جاری</p>
            </div>

            <div className="space-y-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-slate-950">
                {toPersianDigits(filterOptions.cities.length)}
              </p>
              <p className="text-xs font-bold text-slate-500">کلان‌شهر تحت پوشش مستقیم</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-right">
        <div className="mx-auto max-w-2xl text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>مزایای معامله با ما</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
            چرا مسکن پلاس را انتخاب کنیم؟
          </h2>
          <p className="text-sm text-slate-500">
            ما با اتکا به تجربه، ابزارهای نوین ارزیابی و تیم حقوقی زبده، اطمینان و آسودگی خاطر را در معامله شما تضمین می‌کنیم.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-amber-400 shadow-md group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-amber-200 transition-colors">
                    {toPersianDigits(`0${idx + 1}`)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {b.title}
                </h3>

                <p className="text-xs leading-relaxed text-slate-500">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-right">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600">دسته‌بندی‌های اصلی</span>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              جستجو بر اساس نوع کاربری ملک
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              دسترسی سریع به صدها آگهی متناسب با کاربری و نیاز شما
            </p>
          </div>

          <Link
            href="/properties"
            className="text-xs font-bold text-slate-800 hover:text-amber-600 transition-colors inline-flex items-center gap-1"
          >
            <span>مشاهده همه دسته‌ها</span>
            <ArrowLeft className="h-3.5 w-3.5 text-amber-500" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={`/properties?propertyType=${cat.slug}`}
                className="group relative flex flex-col justify-end overflow-hidden rounded-3xl aspect-4/5 bg-slate-900 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              >

                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                <div className="relative z-10 p-6 space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/90 text-slate-950 shadow-md">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {cat.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-amber-400 font-bold border-t border-white/10">
                    <span>{formatNumber(cat.count)} ملک موجود</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      مشاهده <ChevronLeft className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-slate-900 p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">

          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />

          <div className="lg:col-span-6 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-400 border border-amber-500/30">
              <PhoneCall className="h-4 w-4" />
              <span>مشاوره کاملاً رایگان و اختصاصی</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white">
              در جستجو یا فروش ملک به مشاوره حرفه‌ای نیاز دارید؟
            </h2>

            <p className="text-sm leading-relaxed text-slate-300">
              کافی است مشخصات خود را ثبت فرمایید تا کارشناس ارشد منطقه‌ای مسکن پلاس در کمتر از ۳۰ دقیقه با شما تماس گرفته و دقیق‌ترین تحلیل قیمت و پیشنهادات ملکی را به شما ارائه نماید.
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>بررسی شرایط نقدینگی و پیشنهاد گزینه‌های منعطف پرداختی</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>استعلام دقیق وضعیت پروانه، سند و بدهی‌های احتمالی ملک</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>هماهنگی بازدید حضوری در سریع‌ترین زمان ممکن</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-3xl bg-white p-6 sm:p-9 text-slate-900 shadow-2xl">
            <div className="mb-5 text-right border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                درخواست مشاوره فوری
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                اطلاعات شما نزد مسکن پلاس کاملاً محفوظ است.
              </p>
            </div>

            <ConsultationForm />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-8 sm:p-14 text-slate-950 shadow-xl text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
              قصد فروش یا اجاره دادن ملک خود را دارید؟
            </h2>
            <p className="text-sm sm:text-base font-medium text-slate-900/90 leading-relaxed">
              آگهی ملک خود را در کمتر از ۲ دقیقه به صورت کاملاً رایگان در مسکن پلاس ثبت کنید تا در معرض دید روزانه هزاران خریدار و مستاجر واقعی قرار گیرد.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/submit-property"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-7 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-slate-900 transition-all active:scale-95"
            >
              <PlusCircle className="h-5 w-5 text-amber-400 stroke-[2.5]" />
              <span>ثبت رایگان آگهی ملک</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-950 bg-transparent px-7 py-3.5 text-sm font-bold text-slate-950 hover:bg-slate-950/10 transition-colors"
            >
              <PhoneCall className="h-5 w-5" />
              <span>ارتباط با کارشناسان فروش</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
