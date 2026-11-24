"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  MapPin,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  deletePropertyAction,
  togglePropertyStatusAction,
  togglePropertyFeaturedAction,
} from "@/server/actions/property.actions";
import { formatPrice, formatJalaliDate } from "@/lib/format";
import type { PropertyStatus, ListingType, PropertyType } from "@/types";

export interface PropertyAdminRow {
  id: string;
  title: string;
  slug: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price?: number | null;
  deposit?: number | null;
  monthlyRent?: number | null;
  city: string;
  district?: string | null;
  status: PropertyStatus;
  featured: boolean;
  createdAt: Date | string;
  images?: { url: string }[];
}

interface AdminPropertiesTableProps {
  properties: PropertyAdminRow[];
}

const PROPERTY_STATUS_LABELS: Record<PropertyStatus, { label: string; color: string }> = {
  ACTIVE: { label: "فعال", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  SOLD: { label: "فروخته شد", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  RENTED: { label: "اجاره داده شد", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  HIDDEN: { label: "مخفی", color: "bg-slate-700/50 text-slate-400 border-slate-700" },
};

export function AdminPropertiesTable({ properties }: AdminPropertiesTableProps) {
  const [, startTransition] = useTransition();
  const [prevProperties, setPrevProperties] = useState(properties);
  const [propertyList, setPropertyList] = useState<PropertyAdminRow[]>(properties);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  if (prevProperties !== properties) {
    setPrevProperties(properties);
    setPropertyList(properties);
  }

  const handleStatusChange = async (id: string, newStatus: PropertyStatus) => {
    setPropertyList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    startTransition(async () => {
      const res = await togglePropertyStatusAction(id, newStatus);
      if (!res.success) {
        setActionError(res.error || "خطا در تغییر وضعیت.");
        setPropertyList(properties);
      }
    });
  };

  const handleFeaturedToggle = async (id: string, currentVal: boolean) => {
    const newVal = !currentVal;
    setPropertyList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: newVal } : p))
    );

    startTransition(async () => {
      const res = await togglePropertyFeaturedAction(id, newVal);
      if (!res.success) {
        setActionError(res.error || "خطا در تغییر وضعیت ویژه.");
        setPropertyList(properties);
      }
    });
  };

  const handleExecuteDelete = async () => {
    if (!deleteModalId) return;
    setDeletingId(deleteModalId);
    setActionError(null);

    try {
      const res = await deletePropertyAction(deleteModalId);
      if (!res.success) {
        setActionError(res.error || "خطا در حذف ملک.");
      } else {
        setPropertyList((prev) => prev.filter((p) => p.id !== deleteModalId));
        setDeleteModalId(null);
      }
    } catch {
      setActionError("خطای سیستمی در حذف ملک.");
    } finally {
      setDeletingId(null);
    }
  };

  const propertyToDelete = propertyList.find((p) => p.id === deleteModalId);

  return (
    <>
      {actionError && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-bold text-rose-300">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
        <table className="w-full min-w-[850px] border-collapse text-right text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-850 text-slate-400">
              <th className="py-3.5 px-4 font-bold">ملک و تصویر</th>
              <th className="py-3.5 px-4 font-bold">نوع معامله</th>
              <th className="py-3.5 px-4 font-bold">قیمت / شرایط</th>
              <th className="py-3.5 px-4 font-bold">وضعیت انتشار</th>
              <th className="py-3.5 px-4 font-bold text-center">آگهی ویژه</th>
              <th className="py-3.5 px-4 font-bold">تاریخ ثبت (جلالی)</th>
              <th className="py-3.5 px-4 font-bold text-center">عملیات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {propertyList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  هیچ ملکی با این مشخصات یافت نشد.
                </td>
              </tr>
            ) : (
              propertyList.map((prop) => {
                const primaryImage =
                  prop.images && prop.images.length > 0
                    ? prop.images[0].url
                    : "/images/properties/prop-1.webp";

                return (
                  <tr key={prop.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-800 border border-slate-700">
                          <Image
                            src={primaryImage}
                            alt={prop.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <span className="block font-bold text-slate-100 truncate hover:text-blue-400 transition-colors">
                            {prop.title}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                            <span>
                              {prop.city}
                              {prop.district ? `، ${prop.district}` : ""}
                            </span>
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold border ${
                          prop.listingType === "SALE"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : "bg-sky-500/10 text-sky-400 border-sky-500/30"
                        }`}
                      >
                        {prop.listingType === "SALE" ? "فروش" : "رهن و اجاره"}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      {prop.listingType === "SALE" ? (
                        <span className="font-bold text-slate-100">
                          {formatPrice(prop.price, "تومان", { fallbackToNegotiable: true })}
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <div className="text-[11px] text-slate-400">
                            رهن:{" "}
                            <span className="font-bold text-slate-200">
                              {formatPrice(prop.deposit, "تومان", { fallbackToNegotiable: true })}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            اجاره:{" "}
                            <span className="font-bold text-blue-400">
                              {formatPrice(prop.monthlyRent, "تومان", { fallbackToNegotiable: true })}
                            </span>
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={prop.status}
                        onChange={(e) =>
                          handleStatusChange(prop.id, e.target.value as PropertyStatus)
                        }
                        className={`rounded-lg border px-2.5 py-1 text-xs font-bold focus:outline-none bg-slate-900 cursor-pointer ${
                          PROPERTY_STATUS_LABELS[prop.status]?.color || ""
                        }`}
                      >
                        <option value="ACTIVE">فعال</option>
                        <option value="SOLD">فروخته شد</option>
                        <option value="RENTED">اجاره داده شد</option>
                        <option value="HIDDEN">مخفی</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleFeaturedToggle(prop.id, prop.featured)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                          prop.featured
                            ? "bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/20"
                            : "bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300"
                        }`}
                        title={prop.featured ? "حذف از املاک ویژه" : "تنظیم به عنوان ملک ویژه"}
                      >
                        <Sparkles className="h-4 w-4" />
                      </button>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {formatJalaliDate(prop.createdAt)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">

                        <Link
                          href={`/admin/properties/${prop.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
                          title="ویرایش ملک"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>

                        <Link
                          href={`/properties/${prop.slug}`}
                          target="_blank"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-sky-500 hover:text-sky-400 transition-colors"
                          title="مشاهده آگهی در وب‌سایت"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeleteModalId(prop.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                          title="حذف ملک"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-right">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="text-base font-black text-white">تأیید حذف ملک</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              آیا از حذف ملک{" "}
              <span className="font-bold text-slate-200">«{propertyToDelete?.title}»</span> اطمینان
              دارید؟ کلیه تصاویر و اطلاعات مرتبط نیز حذف خواهند شد. این عملیات غیرقابل بازگشت است.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                disabled={Boolean(deletingId)}
                className="rounded-xl border border-slate-800 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={Boolean(deletingId)}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-500 transition-colors disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>در حال حذف...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>حذف قطعی ملک</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPropertiesTable;
