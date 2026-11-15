import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Search, ChevronRight, ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { AdminInquiriesTable } from "@/components/admin/AdminInquiriesTable";
import { toPersianDigits, formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "درخواست‌های مشاوره | پنل مدیریت",
  description: "مدیریت پیام‌ها و درخواست‌های بازدید و مشاوره املاک مسکن پلاس",
};

interface SearchParamsProps {
  status?: string;
  query?: string;
  page?: string;
}

const ITEMS_PER_PAGE = 12;

async function InquiriesContent({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const { status, query, page: pageStr } = await searchParams;

  const currentPage = Math.max(1, Number(pageStr) || 1);
  const searchTerm = query?.trim() || "";

  const where: Prisma.InquiryWhereInput = {};

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm } },
      { phone: { contains: searchTerm } },
      { message: { contains: searchTerm } },
    ];
  }

  if (status === "UNREAD") {
    where.isRead = false;
  } else if (status === "READ") {
    where.isRead = true;
  }

  const [total, unreadCount, inquiries] = await Promise.all([
    prisma.inquiry.count({ where }),
    prisma.inquiry.count({ where: { isRead: false } }),
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const createQueryUrl = (newParams: { status?: string; query?: string; page?: string }) => {
    const params = new URLSearchParams();
    if (newParams.query !== undefined) {
      if (newParams.query) params.set("query", newParams.query);
    } else if (searchTerm) {
      params.set("query", searchTerm);
    }

    if (newParams.status !== undefined) {
      if (newParams.status && newParams.status !== "ALL") params.set("status", newParams.status);
    } else if (status && status !== "ALL") {
      params.set("status", status);
    }

    const targetPage = newParams.page !== undefined ? newParams.page : String(currentPage);
    if (targetPage && targetPage !== "1") {
      params.set("page", targetPage);
    }

    const qs = params.toString();
    return qs ? `/admin/inquiries?${qs}` : "/admin/inquiries";
  };

  const statusTabs = [
    { label: "همه پیام‌ها", value: "ALL" },
    { label: `خوانده‌نشده (${toPersianDigits(unreadCount)})`, value: "UNREAD" },
    { label: "خوانده‌شده", value: "READ" },
  ];

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Mail className="h-6 w-6 text-blue-400" />
            <span>درخواست‌های تماس و مشاوره</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            مجموعاً {formatNumber(total)} پیام دریافت شده است ({toPersianDigits(unreadCount)} نیاز به پیگیری).
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">

        <form method="GET" action="/admin/inquiries" className="relative flex-1 max-w-md">
          {status && status !== "ALL" && (
            <input type="hidden" name="status" value={status} />
          )}
          <input
            type="text"
            name="query"
            defaultValue={searchTerm}
            placeholder="جستجو بر اساس نام متقاضی، شماره یا متن پیام..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 pr-10 focus:border-blue-500 focus:outline-none"
          />
          <Search className="pointer-events-none absolute right-3.5 top-2.5 h-4 w-4 text-slate-500" />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statusTabs.map((tab) => {
            const isSelected = (!status && tab.value === "ALL") || status === tab.value;
            return (
              <Link
                key={tab.value}
                href={createQueryUrl({ status: tab.value, page: "1" })}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? "bg-blue-600 text-white font-black shadow-sm shadow-blue-500/20"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <AdminInquiriesTable inquiries={inquiries} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 pt-5 text-xs text-slate-400">
          <span>
            صفحه {toPersianDigits(currentPage)} از {toPersianDigits(totalPages)}
          </span>

          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={createQueryUrl({ page: String(currentPage - 1) })}
                className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
                <span>قبلی</span>
              </Link>
            ) : null}

            {currentPage < totalPages ? (
              <Link
                href={createQueryUrl({ page: String(currentPage + 1) })}
                className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <span>بعدی</span>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export function InquiriesLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-right">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-xl bg-slate-800" />
          <div className="h-3 w-48 rounded bg-slate-800/60" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
        <div className="h-9 w-full max-w-md rounded-xl bg-slate-800" />
        <div className="flex items-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-16 rounded-xl bg-slate-800/70" />
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/90">
        <div className="p-4 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-slate-800" />
          <div className="h-4 w-28 rounded bg-slate-800" />
          <div className="h-4 w-40 rounded bg-slate-800" />
          <div className="h-4 w-20 rounded bg-slate-800" />
          <div className="h-4 w-16 rounded bg-slate-800" />
        </div>
        <div className="divide-y divide-slate-800/60">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="h-4 w-28 rounded bg-slate-800" />
                <div className="h-3 w-20 rounded bg-slate-800/60" />
              </div>
              <div className="h-4 w-24 rounded bg-slate-800" />
              <div className="space-y-1">
                <div className="h-4 w-48 rounded bg-slate-800" />
                <div className="h-3 w-36 rounded bg-slate-800/60" />
              </div>
              <div className="h-6 w-20 rounded-lg bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-slate-800" />
                <div className="h-8 w-8 rounded-lg bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  return (
    <Suspense fallback={<InquiriesLoadingSkeleton />}>
      <InquiriesContent searchParams={searchParams} />
    </Suspense>
  );
}
