import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search, Building2, ChevronRight, ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { AdminPropertiesTable } from "@/components/admin/AdminPropertiesTable";
import { toPersianDigits, formatNumber } from "@/lib/format";
import type { PropertyStatus } from "@/types";

export const metadata: Metadata = {
  title: "مدیریت املاک | پنل مدیریت",
  description: "لیست، جستجو، ویرایش و مدیریت وضعیت املاک مسکن پلاس",
};

interface SearchParamsProps {
  query?: string;
  status?: string;
  page?: string;
}

const ITEMS_PER_PAGE = 10;

async function PropertiesContent({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const { query, status, page: pageStr } = await searchParams;

  const currentPage = Math.max(1, Number(pageStr) || 1);
  const searchTerm = query?.trim() || "";

  const where: Prisma.PropertyWhereInput = {};

  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm } },
      { address: { contains: searchTerm } },
      { city: { contains: searchTerm } },
      { district: { contains: searchTerm } },
    ];
  }

  if (status && status !== "ALL") {
    where.status = status as PropertyStatus;
  }

  const [total, properties] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        images: {
          take: 1,
          orderBy: { order: "asc" },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const createQueryUrl = (newParams: { page?: string; status?: string; query?: string }) => {
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
    return qs ? `/admin/properties?${qs}` : "/admin/properties";
  };

  const statusOptions = [
    { label: "همه املاک", value: "ALL" },
    { label: "فعال", value: "ACTIVE" },
    { label: "فروخته شد", value: "SOLD" },
    { label: "اجاره داده شد", value: "RENTED" },
    { label: "مخفی", value: "HIDDEN" },
  ];

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-400" />
            <span>مدیریت فایل‌های املاک</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            مجموعاً {formatNumber(total)} ملک در سامانه ثبت شده است.
          </p>
        </div>

        <Link
          href="/admin/properties/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>ثبت ملک جدید</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">

        <form method="GET" action="/admin/properties" className="relative flex-1 max-w-md">
          {status && status !== "ALL" && (
            <input type="hidden" name="status" value={status} />
          )}
          <input
            type="text"
            name="query"
            defaultValue={searchTerm}
            placeholder="جستجو بر اساس عنوان، شهر، منطقه یا آدرس..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 pr-10 focus:border-blue-500 focus:outline-none"
          />
          <Search className="pointer-events-none absolute right-3.5 top-2.5 h-4 w-4 text-slate-500" />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statusOptions.map((opt) => {
            const isSelected = (!status && opt.value === "ALL") || status === opt.value;
            return (
              <Link
                key={opt.value}
                href={createQueryUrl({ status: opt.value, page: "1" })}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? "bg-blue-600 text-white font-black shadow-sm shadow-blue-500/20"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>
      </div>

      <AdminPropertiesTable
        properties={properties.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          listingType: p.listingType,
          propertyType: p.propertyType,
          price: p.price,
          deposit: p.deposit,
          monthlyRent: p.monthlyRent,
          city: p.city,
          district: p.district,
          status: p.status,
          featured: p.featured,
          createdAt: p.createdAt,
          images: p.images,
        }))}
      />

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

function PropertiesLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-12 w-64 rounded-2xl bg-slate-800" />
      <div className="h-16 w-full rounded-2xl bg-slate-800" />
      <div className="h-96 w-full rounded-2xl bg-slate-800" />
    </div>
  );
}

export default function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  return (
    <Suspense fallback={<PropertiesLoadingSkeleton />}>
      <PropertiesContent searchParams={searchParams} />
    </Suspense>
  );
}
