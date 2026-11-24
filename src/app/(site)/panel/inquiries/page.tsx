import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, CheckCircle2, MessageSquare, Building2, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";
import { formatNumber, toPersianDigits } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "درخواست‌های من | پنل کاربری",
  description: "پیگیری وضعیت درخواست‌های مشاوره و پیام‌های ارسال‌شده",
};

export const instant = false;

export default async function UserInquiriesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const inquiries = await prisma.inquiry.findMany({
    where: {
      OR: [{ userId: user.id }, { phone: user.phone }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          slug: true,
          city: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/90 dark:border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span>درخواست‌های مشاوره و پیام‌های من</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          مجموعاً {formatNumber(inquiries.length)} پیام یا درخواست مشاوره ثبت شده است.
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              پیام یا درخواستی ثبت نکرده‌اید
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              شما می‌توانید در صفحه هر ملک یا در بخش تماس با ما، درخواست مشاوره حضوری یا تلفنی ثبت فرمایید.
            </p>
          </div>
          <Link href="/properties">
            <Button variant="primary" size="lg">
              مشاهده املاک و درخواست مشاوره
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{inq.isRead ? "بررسی شده توسط کارشناس" : "در نوبت پیگیری"}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{toPersianDigits(new Date(inq.createdAt).toLocaleDateString("fa-IR"))}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                  {inq.message}
                </p>

                {inq.property && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>مرتبط با ملک: {inq.property.title} ({inq.property.city})</span>
                    </span>
                    <Link
                      href={`/properties/${inq.property.slug}`}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>مشاهده ملک</span>
                      <ArrowLeft className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
