import React from "react";
import Link from "next/link";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toPersianDigits } from "@/lib/format";

export function SiteFooter() {
  const currentYear = toPersianDigits(1403);

  const quickLinks = [
    { label: "خرید و فروش آپارتمان", href: "/properties?listingType=SALE&propertyType=APARTMENT" },
    { label: "رهن و اجاره خانه و آپارتمان", href: "/properties?listingType=RENT&propertyType=APARTMENT" },
    { label: "ویلاهای لوکس و اختصاصی", href: "/properties?propertyType=VILLA" },
    { label: "دفاتر کار و املاک تجاری", href: "/properties?propertyType=OFFICE" },
    { label: "مقایسه مشخصات املاک", href: "/compare" },
  ];

  const serviceLinks = [
    { label: "ثبت آگهی رایگان ملک", href: "/submit-property" },
    { label: "درخواست مشاوره تخصصی", href: "/contact" },
    { label: "راهنمای جامع خرید ملک", href: "/guide" },
    { label: "قوانین و مقررات معاملات", href: "/rules" },
    { label: "پرسش‌های متداول کاربران", href: "/faq" },
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300 transition-colors">
      <div className="border-b border-slate-800/80 bg-slate-950/40 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">آگهی‌های کارشناسی شده</h4>
                <p className="text-xs text-slate-400">بررسی اصالت اسناد و مدارک املاک</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">مشاوره حقوقی رایگان</h4>
                <p className="text-xs text-slate-400">همراهی وکیل پایه یک در نگارش قرارداد</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">پشتیبانی همه‌روزه</h4>
                <p className="text-xs text-slate-400">پاسخگویی از ساعت ۸ صبح تا ۲۲ شب</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 text-right">
          <div className="space-y-5 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                <Building2 className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">
                  سر<span className="text-blue-400">پناه</span>
                </span>
                <span className="text-xs text-slate-400">سامانه هوشمند معاملات املاک</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              سرپناه با هدف شفافیت، سرعت و امنیت در معاملات ملکی راه‌اندازی شده است. با دسترسی به معتبرترین بانک اطلاعاتی املاک فروش و رهن و اجاره، در هر کجای کشور ملک ایده‌آل خود را به سادگی بیابید.
            </p>

            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
              <span>بیش از ۱۰۰۰ ملک فعال و کارشناسی شده در سراسر ایران</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-r-2 border-blue-500 pr-2.5">
              دسترسی سریع
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <ChevronLeft className="h-3 w-3 text-slate-600" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-r-2 border-blue-500 pr-2.5">
              خدمات و راهنما
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <ChevronLeft className="h-3 w-3 text-slate-600" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-r-2 border-blue-500 pr-2.5">
              ارتباط با ما
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span>ساری، بلوار فرهنگ، نبش خیابان پیوند، برج سرپناه</span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                <span dir="ltr" className="font-semibold text-slate-200">
                  ۰۱۱-۳۳۲۲۴۴۵۵
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <span dir="ltr" className="text-slate-300">
                  support@sarpanah.ir
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-blue-400 shrink-0" />
                <span>شنبه تا پنج‌شنبه: ۸:۰۰ الی ۲۲:۰۰</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            تمامی حقوق مادی و معنوی این سامانه متعلق به شرکت فناوری املاک <strong className="text-slate-400">سرپناه</strong> می‌باشد. © {currentYear}
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-blue-400 transition-colors">
              حریم خصوصی
            </Link>
            <span>•</span>
            <Link href="/rules" className="hover:text-blue-400 transition-colors">
              قوانین انتشار آگهی
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
