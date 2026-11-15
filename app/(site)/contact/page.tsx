import type { Metadata } from "next";
import Link from "next/link";
import {
  PhoneCall,
  MapPin,
  Clock,
  Mail,
  ShieldCheck,
  ChevronLeft,
  Building2,
  HelpCircle,
  Headphones,
} from "lucide-react";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "تماس با ما | مسکن پلاس",
  description:
    "راه‌های ارتباطی، آدرس دفتر مرکزی، شماره تماس مشاورین ملکی و فرم ثبت درخواست مشاوره حقوقی و ملکی در سامانه مسکن پلاس.",
};

export default function ContactPage() {
  const contactCards = [
    {
      icon: PhoneCall,
      title: "تلفن‌های تماس مستقیم",
      subtitle: "پاسخگویی سریع مشاوران ملکی",
      primaryValue: "۰۲۱-۲۲۳۳۴۴۵۵",
      secondaryValue: "۰۲۱-۸۸۹۹۰۰۱۱",
      link: "tel:02122334455",
      accent: "amber",
    },
    {
      icon: MapPin,
      title: "نشانی دفتر مرکزی",
      subtitle: "ملاقات حضوری با هماهنگی قبلی",
      primaryValue: "تهران، سعادت‌آباد، بلوار فرهنگ",
      secondaryValue: "نبش خیابان پیوند، برج مسکن پلاس، طبقه ۵",
      link: "https://nshn.ir",
      accent: "sky",
    },
    {
      icon: Clock,
      title: "ساعات کاری و پاسخگویی",
      subtitle: "همه روزه بدون تعطیلی",
      primaryValue: "شنبه تا چهارشنبه: ۸:۰۰ الی ۲۲:۰۰",
      secondaryValue: "پنج‌شنبه و جمعه: ۹:۰۰ الی ۲۰:۰۰",
      link: null,
      accent: "emerald",
    },
    {
      icon: Mail,
      title: "پست الکترونیک رسمی",
      subtitle: "امور اداری، پشتیبانی و قراردادها",
      primaryValue: "support@maskanplus.ir",
      secondaryValue: "legal@maskanplus.ir",
      link: "mailto:support@maskanplus.ir",
      accent: "indigo",
    },
  ];

  const faqs = [
    {
      q: "آیا دریافت مشاوره ملکی در مسکن پلاس مشمول هزینه است؟",
      a: "خیر، تمامی مشاوره‌های تلفنی، ارزیابی اولیه قیمت و پاسخ به پرسش‌های شما توسط تیم کارشناسان ما به صورت کاملاً رایگان ارائه می‌شود.",
    },
    {
      q: "چگونه می‌توانم ملک خود را برای فروش یا رهن و اجاره ثبت کنم؟",
      a: "شما می‌توانید از دکمه «ثبت آگهی رایگان» در بالای سایت استفاده فرمایید یا از طریق فرم همین صفحه درخواست خود را ارسال کنید تا کارشناسان مربوطه با شما تماس بگیرند.",
    },
    {
      q: "آیا در جلسات قرارداد وکیل حقوقی حضور دارد؟",
      a: "بله، در تمامی مراحل نگارش مبایعه‌نامه و اجاره‌نامه، کارشناس ارشد حقوقی مسکن پلاس جهت اعتبارسنجی اسناد ثبتی و حفظ حقوق طرفین در کنار شما خواهد بود.",
    },
    {
      q: "مدت زمان پاسخگویی به درخواست‌های ثبت‌شده چقدر است؟",
      a: "کلیه پیام‌ها و درخواست‌های مشاوره ظرف حداکثر ۱ ساعت کاری بررسی شده و کارشناس متخصص منطقه با شماره درج‌شده تماس خواهد گرفت.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-14">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          صفحه اصلی
        </Link>
        <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-bold text-slate-900">تماس با ما</span>
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-black text-amber-900 border border-amber-500/20">
          <Headphones className="h-4 w-4 text-amber-600" />
          <span>پاسخگویی و پشتیبانی همه‌روزه</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          ارتباط با کارشناسان مسکن پلاس
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          پرسش، پیشنهاد یا نیاز به مشاوره تخصصی در زمینه خرید، فروش، رهن یا اجاره دارید؟ تیم پشتیبانی و مشاوران حقوقی ما مشتاقانه آماده پاسخگویی به شما هستند.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {contactCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between gap-4 text-right"
            >
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-amber-400 shadow-xs">
                  <Icon className="h-6 w-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{card.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{card.subtitle}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                {card.link ? (
                  <a
                    href={card.link}
                    className="block font-black text-slate-800 hover:text-amber-600 transition-colors"
                  >
                    {card.primaryValue}
                  </a>
                ) : (
                  <p className="font-black text-slate-800">{card.primaryValue}</p>
                )}
                <p className="text-slate-500 text-[11px] font-medium">{card.secondaryValue}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">ارسال پیام یا درخواست مشاوره</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                فرم زیر را تکمیل فرمایید تا کارشناس متخصص در کمتر از یک ساعت با شما تماس بگیرد
              </p>
            </div>
          </div>

          <ContactForm />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200/90 bg-slate-900 p-6 sm:p-8 text-white space-y-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black">
                <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-black text-white text-base">همراهی حقوقی در تمام مراحل</h3>
                <p className="text-xs text-slate-400 mt-0.5">مشاوره تخصصی و ایمن در قراردادها</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              کارشناسان مسکن پلاس قبل از هرگونه پرداخت، اصالت سند ثبتی، کاربری شهرداری و مدارک هویتی مالک را استعلام می‌نمایند تا تجربه‌ای امن و مطمئن در معاملات ملکی رقم بخورد.
            </p>

            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>تلفن تماس فوری:</span>
                <a href="tel:02122334455" className="font-bold text-amber-400 hover:underline" dir="ltr">
                  021-22334455
                </a>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>پشتیبانی شبانه‌روزی:</span>
                <span className="font-bold text-emerald-400">۲۴ ساعته فعال</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-slate-50 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
              <MapPin className="h-4 w-4 text-amber-500" />
              <span>موقعیت مکانی دفتر مرکزی مسکن پلاس</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              تهران، سعادت‌آباد، میدان کاج، بلوار فرهنگ، نبش خیابان پیوند، برج تجاری-اداری مسکن پلاس، ورودی شمالی، طبقه ۵، واحد ۵۰۲
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <span>مسیریابی روی نقشه</span>
                <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">پرسش‌های متداول شما</h2>
            <p className="text-xs text-slate-500 mt-0.5">پاسخ به سوالات پرتکرار مراجعین و خریداران محترم</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-2 text-right"
            >
              <h3 className="font-black text-slate-900 text-sm">{faq.q}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
