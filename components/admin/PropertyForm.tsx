"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  X,
  ArrowUp,
  ArrowDown,
  Building2,
  DollarSign,
  Maximize2,
  MapPin,
  Sparkles,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { createPropertyAction, updatePropertyAction } from "@/server/actions/property.actions";
import { propertyZodSchema, type PropertyInput } from "@/lib/validations/property.zod";
import { createSlug } from "@/lib/utils";
import type { ListingType, PropertyType, PropertyStatus } from "@/types";

interface PropertyFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    listingType: ListingType;
    propertyType: PropertyType;
    price?: number | null;
    deposit?: number | null;
    monthlyRent?: number | null;
    area: number;
    bedrooms: number;
    bathrooms: number;
    floor?: number | null;
    yearBuilt?: number | null;
    parking: boolean;
    elevator: boolean;
    storage: boolean;
    balcony: boolean;
    city: string;
    district?: string | null;
    address?: string | null;
    featured: boolean;
    status: PropertyStatus;
    images?: { id?: string; url: string; order: number }[];
  };
}

export function PropertyForm({ initialData }: PropertyFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialData?.slug));
  const [description, setDescription] = useState(initialData?.description || "");
  const [listingType, setListingType] = useState<ListingType>(initialData?.listingType || "SALE");
  const [propertyType, setPropertyType] = useState<PropertyType>(initialData?.propertyType || "APARTMENT");

  const [price, setPrice] = useState<string>(
    initialData?.price !== undefined && initialData?.price !== null ? String(initialData.price) : ""
  );
  const [deposit, setDeposit] = useState<string>(
    initialData?.deposit !== undefined && initialData?.deposit !== null ? String(initialData.deposit) : ""
  );
  const [monthlyRent, setMonthlyRent] = useState<string>(
    initialData?.monthlyRent !== undefined && initialData?.monthlyRent !== null
      ? String(initialData.monthlyRent)
      : ""
  );

  const [area, setArea] = useState<string>(initialData?.area ? String(initialData.area) : "");
  const [bedrooms, setBedrooms] = useState<string>(
    initialData?.bedrooms !== undefined ? String(initialData.bedrooms) : "1"
  );
  const [bathrooms, setBathrooms] = useState<string>(
    initialData?.bathrooms !== undefined ? String(initialData.bathrooms) : "1"
  );
  const [floor, setFloor] = useState<string>(
    initialData?.floor !== undefined && initialData?.floor !== null ? String(initialData.floor) : ""
  );
  const [yearBuilt, setYearBuilt] = useState<string>(
    initialData?.yearBuilt !== undefined && initialData?.yearBuilt !== null ? String(initialData.yearBuilt) : ""
  );

  const [parking, setParking] = useState(initialData?.parking ?? false);
  const [elevator, setElevator] = useState(initialData?.elevator ?? false);
  const [storage, setStorage] = useState(initialData?.storage ?? false);
  const [balcony, setBalcony] = useState(initialData?.balcony ?? false);

  const [city, setCity] = useState(initialData?.city || "تهران");
  const [district, setDistrict] = useState(initialData?.district || "");
  const [address, setAddress] = useState(initialData?.address || "");

  const [status, setStatus] = useState<PropertyStatus>(initialData?.status || "ACTIVE");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);

  const [images, setImages] = useState<{ id?: string; url: string; order: number }[]>(
    initialData?.images?.sort((a, b) => a.order - b.order) || []
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(createSlug(val));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setFormError(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "خطا در آپلود تصاویر.");
      } else {
        const uploadedUrls: string[] = data.urls || [data.url];
        setImages((prev) => [
          ...prev,
          ...uploadedUrls.map((url, i) => ({
            url,
            order: prev.length + i,
          })),
        ]);
      }
    } catch {
      setFormError("خطا در برقراری ارتباط با سرور آپلود.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [
      ...prev,
      {
        url: newImageUrl.trim(),
        order: prev.length,
      },
    ]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((img, i) => ({ ...img, order: i }));
    });
  };

  const handleMoveImageUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return updated.map((img, i) => ({ ...img, order: i }));
    });
  };

  const handleMoveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return updated.map((img, i) => ({ ...img, order: i }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    const payload: PropertyInput = {
      title,
      slug: slug.trim() ? slug.trim() : undefined,
      description,
      listingType,
      propertyType,
      price: listingType === "SALE" && price !== "" ? Number(price) : undefined,
      deposit: listingType === "RENT" && deposit !== "" ? Number(deposit) : undefined,
      monthlyRent: listingType === "RENT" && monthlyRent !== "" ? Number(monthlyRent) : undefined,
      area: Number(area),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      floor: floor !== "" ? Number(floor) : undefined,
      yearBuilt: yearBuilt !== "" ? Number(yearBuilt) : undefined,
      parking,
      elevator,
      storage,
      balcony,
      city,
      district: district.trim() ? district.trim() : null,
      address,
      featured,
      status,
      images,
    };

    const validationResult = propertyZodSchema.safeParse(payload);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0]?.message || "لطفاً اطلاعات را با دقت تکمیل فرمایید.";
      setFormError(firstError);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      let res;
      if (isEdit && initialData?.id) {
        res = await updatePropertyAction(initialData.id, payload);
      } else {
        res = await createPropertyAction(payload);
      }

      if (!res.success) {
        setFormError(res.error || "خطا در ذخیره اطلاعات ملک.");
      } else {
        setFormSuccess(res.message || "اطلاعات با موفقیت ذخیره شد.");
        setTimeout(() => {
          router.push("/admin/properties");
          router.refresh();
        }, 1200);
      }
    } catch {
      setFormError("خطای غیرمنتظره در ثبت ملک.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/properties" className="hover:text-slate-300 transition-colors">
              املاک
            </Link>
            <span>/</span>
            <span className="text-slate-400">{isEdit ? "ویرایش آگهی ملک" : "ثبت ملک جدید"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {isEdit ? `ویرایش ملک: ${initialData?.title}` : "ثبت و انتشار آگهی ملک جدید"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties"
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            انصراف و بازگشت
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-md hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isEdit ? "ذخیره تغییرات" : "ثبت و انتشار ملک"}</span>
          </button>
        </div>
      </div>

      {formError && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-bold text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{formSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

        <div className="space-y-6 lg:col-span-8">

          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-400" />
              <span>مشخصات و عنوان ملک</span>
            </h2>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                عنوان آگهی <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="مثال: فروش آپارتمان ۱۶۰ متری لوکس در سعادت‌آباد"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                نامک یکتا در آدرس اینترنتی (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                dir="ltr"
                placeholder="slug-url-property"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none text-left"
              />
              <span className="block text-[11px] text-slate-500">
                به صورت خودکار از عنوان فارسی تولید می‌شود یا می‌توانید دستی ویرایش کنید.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                توضیحات کامل ملک <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات دقیق درباره موقعیت، نورگیری، نقشه، سند و شرایط تحویل..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>نوع معامله و مبالغ مالی</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  نوع معامله <span className="text-rose-400">*</span>
                </label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value as ListingType)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="SALE">خرید و فروش</option>
                  <option value="RENT">رهن و اجاره</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  نوع ملک <span className="text-rose-400">*</span>
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="APARTMENT">آپارتمان</option>
                  <option value="VILLA">ویلا</option>
                  <option value="LAND">زمین و کلنگی</option>
                  <option value="OFFICE">اداری</option>
                  <option value="SHOP">تجاری و مغازه</option>
                </select>
              </div>
            </div>

            {listingType === "SALE" ? (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  قیمت کل فروش (تومان) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="مثال: ۲۵۰۰۰۰۰۰۰۰۰"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none text-left"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    مبلغ ودیعه / رهن (تومان) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    placeholder="مثال: ۱۰۰۰۰۰۰۰۰۰"
                    dir="ltr"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none text-left"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    اجاره ماهانه (تومان) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    placeholder="مثال: ۳۵۰۰۰۰۰۰ (برای رهن کامل ۰ بگذارید)"
                    dir="ltr"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none text-left"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-sky-400" />
              <span>مشخصات فنی و متراژ</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  متراژ (متر مربع) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="مثال: ۱۴۰"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none text-left"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">تعداد خواب</label>
                <input
                  type="number"
                  min={0}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="مثال: ۳"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none text-left"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">سرویس بهداشتی</label>
                <input
                  type="number"
                  min={1}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  placeholder="مثال: ۲"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none text-left"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">طبقه</label>
                <input
                  type="number"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="مثال: ۴ (همکف: ۰)"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none text-left"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">سال ساخت</label>
                <input
                  type="number"
                  min={1350}
                  max={1405}
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                  placeholder="مثال: ۱۴۰۲"
                  dir="ltr"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none text-left"
                />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <span className="block text-xs font-bold text-slate-300 mb-3">امکانات اصلی ملک</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-800/40 p-3 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={parking}
                    onChange={(e) => setParking(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 text-blue-500 focus:ring-blue-500 bg-slate-900"
                  />
                  <span className="text-xs font-medium text-slate-200">پارکینگ اختصاصی</span>
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-800/40 p-3 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={elevator}
                    onChange={(e) => setElevator(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 text-blue-500 focus:ring-blue-500 bg-slate-900"
                  />
                  <span className="text-xs font-medium text-slate-200">آسانسور</span>
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-800/40 p-3 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={storage}
                    onChange={(e) => setStorage(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 text-blue-500 focus:ring-blue-500 bg-slate-900"
                  />
                  <span className="text-xs font-medium text-slate-200">انباری</span>
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-800/40 p-3 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={balcony}
                    onChange={(e) => setBalcony(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 text-blue-500 focus:ring-blue-500 bg-slate-900"
                  />
                  <span className="text-xs font-medium text-slate-200">بالکن / تراس</span>
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-400" />
              <span>موقعیت مکانی و آدرس</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  شهر <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: تهران"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">محله / منطقه</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="مثال: سعادت‌آباد"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                آدرس کامل یا تقاطع <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="مثال: بلوار شهرداری، خیابان سرو غربی، کوچه ارغوان"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">

          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
              وضعیت انتشار و نشان ویژه
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-400">وضعیت ملک</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="ACTIVE">🟢 فعال و آماده بازدید</option>
                <option value="SOLD">🔴 فروخته شده</option>
                <option value="RENTED">🔵 اجاره داده شده</option>
                <option value="HIDDEN">⚫ مخفی و پیش‌نویس</option>
              </select>
            </div>

            <label className="flex items-center gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-blue-500 text-blue-500 focus:ring-blue-500 bg-slate-900"
              />
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>نمایش به عنوان ملک ویژه</span>
              </div>
            </label>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-300">
                تصاویر آگهی ({images.length} تصویر)
              </h3>
              {images.length > 0 && (
                <span className="text-[10px] text-blue-400">تصویر اول کاور اصلی است</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/40 p-4 cursor-pointer hover:border-blue-500 hover:bg-slate-800 transition-all text-center">
                <Upload className="h-6 w-6 text-blue-400 mb-1" />
                <span className="text-xs font-bold text-slate-200">
                  {isUploading ? "در حال آپلود تصاویر..." : "انتخاب یا کشیدن فایل تصاویر"}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  پشتیبانی از چندین تصویر همزمان (JPG, PNG, WebP)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="url"
                  placeholder="یا افزودن لینک مستقیم تصویر..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  dir="ltr"
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 text-left focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="flex items-center justify-center h-8 w-8 rounded-xl bg-slate-800 text-blue-400 hover:bg-slate-700 transition-colors"
                  title="افزودن لینک"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {images.length === 0 ? (
              <p className="text-center text-[11px] text-slate-500 py-3">
                هنوز هیچ تصویری بارگذاری نشده است.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {images.map((img, idx) => (
                  <div
                    key={`${img.url}-${idx}`}
                    className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-850 p-2"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                      <Image
                        src={img.url}
                        alt={`تصویر ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-white text-[9px] font-black text-center">
                          اصلی
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-right">
                      <span className="block truncate text-[11px] font-mono text-slate-300 dir-ltr">
                        {img.url.split("/").pop()}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        ترتیب: {idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveImageUp(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                        title="انتقال به بالا"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveImageDown(idx)}
                        disabled={idx === images.length - 1}
                        className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                        title="انتقال به پایین"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        title="حذف تصویر"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default PropertyForm;
