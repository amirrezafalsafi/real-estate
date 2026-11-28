"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Mail,
  Trash2,
  ExternalLink,
  Phone,
  Eye,
  AlertTriangle,
  X,
  Loader2,
  Building2,
} from "lucide-react";
import {
  toggleInquiryReadAction,
  deleteInquiryAction,
} from "@/server/actions/inquiry.actions";
import { formatJalaliDate, formatPhone } from "@/lib/format";

export interface InquiryAdminItem {
  id: string;
  name: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
  property?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

interface AdminInquiriesTableProps {
  inquiries: InquiryAdminItem[];
}

export function AdminInquiriesTable({ inquiries }: AdminInquiriesTableProps) {
  const [, startTransition] = useTransition();
  const [prevInquiries, setPrevInquiries] = useState(inquiries);
  const [inquiryList, setInquiryList] = useState<InquiryAdminItem[]>(inquiries);
  const [activeMessage, setActiveMessage] = useState<InquiryAdminItem | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  if (prevInquiries !== inquiries) {
    setPrevInquiries(inquiries);
    setInquiryList(inquiries);
  }

  const handleToggleRead = async (id: string, currentVal: boolean) => {
    const newVal = !currentVal;
    setInquiryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: newVal } : item))
    );

    startTransition(async () => {
      const res = await toggleInquiryReadAction(id, newVal);
      if (!res.success) {
        setActionError(res.error || "خطا در تغییر وضعیت درخواست.");
        setInquiryList(inquiries);
      }
    });
  };

  const handleExecuteDelete = async () => {
    if (!deleteModalId) return;
    setDeletingId(deleteModalId);
    setActionError(null);

    try {
      const res = await deleteInquiryAction(deleteModalId);
      if (!res.success) {
        setActionError(res.error || "خطا در حذف درخواست.");
      } else {
        setInquiryList((prev) => prev.filter((item) => item.id !== deleteModalId));
        setDeleteModalId(null);
      }
    } catch {
      setActionError("خطای سیستمی در حذف درخواست.");
    } finally {
      setDeletingId(null);
    }
  };

  const itemToDelete = inquiryList.find((i) => i.id === deleteModalId);

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

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm dark:shadow-xl transition-colors">
        <table className="w-full min-w-[850px] border-collapse text-right text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 text-slate-600 dark:text-slate-400">
              <th className="py-3.5 px-4 font-bold">نام متقاضی</th>
              <th className="py-3.5 px-4 font-bold">شماره تماس</th>
              <th className="py-3.5 px-4 font-bold">ملک مرتبط</th>
              <th className="py-3.5 px-4 font-bold">متن پیام</th>
              <th className="py-3.5 px-4 font-bold">تاریخ ثبت (جلالی)</th>
              <th className="py-3.5 px-4 font-bold text-center">وضعیت</th>
              <th className="py-3.5 px-4 font-bold text-center">عملیات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {inquiryList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  هیچ درخواست مشاوره‌ای یافت نشد.
                </td>
              </tr>
            ) : (
              inquiryList.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                    !item.isRead ? "bg-blue-50/60 dark:bg-blue-500/5" : ""
                  }`}
                >

                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      {!item.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0" title="پیام جدید" />
                      )}
                      <span>{item.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono dir-ltr text-left">
                    <a
                      href={`tel:${item.phone}`}
                      className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Phone className="h-3 w-3 shrink-0" />
                      <span>{formatPhone(item.phone)}</span>
                    </a>
                  </td>

                  <td className="py-3 px-4">
                    {item.property ? (
                      <Link
                        href={`/properties/${item.property.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors max-w-xs truncate"
                        title={item.property.title}
                      >
                        <Building2 className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                        <span className="truncate">{item.property.title}</span>
                        <ExternalLink className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
                      </Link>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">مشاوره عمومی</span>
                    )}
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <p
                      onClick={() => setActiveMessage(item)}
                      className="line-clamp-1 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                      title="کلیک برای مشاهده کامل متن"
                    >
                      {item.message}
                    </p>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {formatJalaliDate(item.createdAt, { includeTime: true })}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleRead(item.id, item.isRead)}
                      className={`inline-block rounded-lg px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                        item.isRead
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-black hover:bg-blue-500/20"
                      }`}
                    >
                      {item.isRead ? "خوانده شده" : "جدید / خوانده نشده"}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">

                      <button
                        type="button"
                        onClick={() => setActiveMessage(item)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="مشاهده پیام کامل"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteModalId(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        title="حذف درخواست"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl text-right transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">جزئیات پیام متقاضی</h3>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[11px]">نام متقاضی:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{activeMessage.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">شماره تماس:</span>
                  <a
                    href={`tel:${activeMessage.phone}`}
                    className="font-bold text-blue-600 dark:text-blue-400 font-mono dir-ltr block text-sm"
                  >
                    {formatPhone(activeMessage.phone)}
                  </a>
                </div>
              </div>

              {activeMessage.property && (
                <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px] mb-1">ملک مورد نظر:</span>
                  <Link
                    href={`/properties/${activeMessage.property.slug}`}
                    target="_blank"
                    className="font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>{activeMessage.property.title}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}

              <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 block text-[11px] mb-1.5">متن پیام یا توضیحات:</span>
                <p className="whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
                  {activeMessage.message}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 pt-1">
                ثبت شده در تاریخ: {formatJalaliDate(activeMessage.createdAt, { includeTime: true })}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => {
                  handleToggleRead(activeMessage.id, activeMessage.isRead);
                  setActiveMessage((prev) => (prev ? { ...prev, isRead: !prev.isRead } : null));
                }}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                  activeMessage.isRead
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    : "bg-blue-600 text-white font-black hover:bg-blue-500"
                }`}
              >
                {activeMessage.isRead ? "تغییر به خوانده‌نشده" : "علامت‌گذاری به عنوان خوانده‌شده"}
              </button>

              <button
                type="button"
                onClick={() => setActiveMessage(null)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl text-right transition-colors">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/30">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="text-base font-black text-slate-900 dark:text-white">تأیید حذف درخواست مشاوره</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              آیا از حذف درخواست تماس متقاضی{" "}
              <span className="font-bold text-slate-900 dark:text-slate-200">«{itemToDelete?.name}»</span> اطمینان
              دارید؟ این پیام برای همیشه پاک خواهد شد.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                disabled={Boolean(deletingId)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
                    <span>حذف قطعی</span>
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

export default AdminInquiriesTable;
