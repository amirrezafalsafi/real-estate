import type { Metadata } from "next";
import Link from "next/link";
import {
  PlusCircle,
  ShieldCheck,
  ChevronLeft,
  Eye,
  CheckCircle,
} from "lucide-react";
import { SubmitPropertyForm } from "@/components/site/SubmitPropertyForm";

export const metadata: Metadata = {
  title: "ثبت رایگان آگهی ملک | مسکن پلاس",
  description:
    "ثبت رایگان آگهی فروش، رهن و اجاره آپارتمان، ویلا، زمین، مغازه و دفتر کار در سامانه مسکن پلاس با امکان کارشناسی تخصصی و بیشترین بازدید.",
};

export default function SubmitPropertyPage() {
  const perks = [
    {
      icon: Eye,
      title: "بیشترین بازدید هدفمند",
      description: "معرفی مستقیم ملک به متقاضیان جدی و خریداران فعال در شهر و منطقه شما.",
    },
    {
      icon: ShieldCheck,
      title: "همراهی حقوقی تا عقد قرارداد",
      description: "مشاوره رایگان حقوقی و پشتیبانی کارشناسان پایه یک در تمامی مراحل معامله.",
    },
    {
      icon: CheckCircle,
      title: "ثبت و انتشار کاملاً رایگان",
      description: "بدون نیاز به پرداخت هزینه و با امکان ویرایش نامحدود مشخصات و تصاویر.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-12 max-w-4xl">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          صفحه اصلی
        </Link>
        <ChevronLeft className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
        <span className="font-bold text-slate-900 dark:text-white">ثبت رایگان آگهی ملک</span>
      </div>

      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 dark:bg-blue-500/15 px-4 py-1.5 text-xs font-black text-blue-700 dark:text-blue-300 border border-blue-500/20">
          <PlusCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>سرویس سراسری ثبت رایگان ملک</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          ثبت رایگان آگهی فروش و اجاره ملک
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          مشخصات، قیمت و تصاویر ملک خود را ثبت فرمایید تا در کوتاه‌ترین زمان در دسترس خریداران و مستاجران محترم قرار گیرد.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {perks.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-right space-y-2 shadow-xs transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Icon className="h-5 w-5 stroke-[2]" />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">{p.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.description}</p>
            </div>
          );
        })}
      </div>

      <SubmitPropertyForm />
    </div>
  );
}
