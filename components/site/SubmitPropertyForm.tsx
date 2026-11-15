"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Sparkles,
  MapPin,
  DollarSign,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { submitPublicPropertyAction } from "@/server/actions/property.actions";
import { formatNumber } from "@/lib/format";
import type { ListingType, PropertyType } from "@/types";

export function SubmitPropertyForm() {
  const [listingType, setListingType] = useState<ListingType>("SALE");
  const [propertyType, setPropertyType] = useState<PropertyType>("APARTMENT");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("1");
  const [floor, setFloor] = useState("");
  const [yearBuilt, setYearBuilt] = useState("1402");
  const [city, setCity] = useState("تهران");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [parking, setParking] = useState(true);
  const [elevator, setElevator] = useState(true);
  const [storage, setStorage] = useState(true);
  const [balcony, setBalcony] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedProperty, setSubmittedProperty] = useState<{
    slug: string;
    title: string;
  } | null>(null);

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
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "خطا در بارگذاری تصویر.");
      } else {
        const newUrls: string[] = data.urls || [data.url];
        setImages((prev) => [...prev, ...newUrls]);
      }
    } catch {
      setFormError("خطا در ارتباط با سرور هنگام آپلود تصویر.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || title.length < 5) {
      setFormError("عنوان آگهی باید حداقل ۵ کاراکتر باشد.");
      return;
    }

    if (!area || Number(area) <= 0) {
      setFormError("متراژ معتبر الزامی است.");
      return;
    }

    if (!city.trim()) {
      setFormError("نام شهر الزامی است.");
      return;
    }

    if (!address.trim()) {
      setFormError("آدرس ملک الزامی است.");
      return;
    }

    if (!description.trim() || description.length < 10) {
      setFormError("توضیحات ملک باید حداقل ۱۰ کاراکتر باشد.");
      return;
    }

    if (!contactPhone.trim() || contactPhone.length < 10) {
      setFormError("شماره تماس معتبر الزامی است.");
      return;
    }

    if (listingType === "SALE" && (!price || Number(price) <= 0)) {
      setFormError("قیمت فروش الزامی است.");
      return;
    }

    if (listingType === "RENT" && (!deposit || Number(deposit) < 0 || !monthlyRent || Number(monthlyRent) < 0)) {
      setFormError("مبلغ ودیعه و اجاره ماهانه الزامی است.");
      return;
    }

    setIsSubmitting(true);

    try {
      const imagePayload = images.map((url, idx) => ({
        url,
        order: idx,
      }));

      const res = await submitPublicPropertyAction({
        title: title.trim(),
        description: description.trim(),
        listingType,
        propertyType,
        price: listingType === "SALE" ? Number(price) : undefined,
        deposit: listingType === "RENT" ? Number(deposit) : undefined,
        monthlyRent: listingType === "RENT" ? Number(monthlyRent) : undefined,
        area: Number(area),
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 1,
        floor: floor ? Number(floor) : undefined,
        yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
        parking,
        elevator,
        storage,
        balcony,
        city: city.trim(),
        district: district.trim() ? district.trim() : null,
        address: address.trim(),
        images: imagePayload,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
      });

      if (!res.success || !res.slug) {
        setFormError(res.error || "خطا در ثبت آگهی. لطفاً دوباره تلاش فرمایید.");
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmittedProperty({
          slug: res.slug,
          title: title.trim(),
        });
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setFormError("خطا در برقراری ارتباط با سرور. لطفاً دوباره تلاش فرمایید.");
      setIsSubmitting(false);
    }
  };

  if (submittedProperty) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
          <CheckCircle2 className="h-10 w-10 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">آگهی شما با موفقیت ثبت شد!</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            آگهی ملک «{submittedProperty.title}» در سامانه ثبت گردید و اکنون در لیست املاک فعال قابل مشاهده است.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={`/properties/${submittedProperty.slug}`}>
            <Button variant="accent" size="lg" className="w-full sm:w-auto font-black text-sm">
              مشاهده آگهی منتشرشده
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setSubmittedProperty(null);
              setTitle("");
              setPrice("");
              setDeposit("");
              setMonthlyRent("");
              setArea("");
              setDescription("");
              setImages([]);
            }}
            className="w-full sm:w-auto text-sm font-bold"
          >
            ثبت یک آگهی جدید دیگر
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {formError && (
        <div className="flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-xs sm:text-sm font-bold animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{formError}</div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Building2 className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-black text-slate-900">اطلاعات پایه و نوع معامله</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-black text-slate-800 mb-2">
              نوع معامله <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setListingType("SALE")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  listingType === "SALE"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                فروش ملک
              </button>
              <button
                type="button"
                onClick={() => setListingType("RENT")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  listingType === "RENT"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                رهن و اجاره
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="property-type" className="block text-xs font-black text-slate-800 mb-2">
              نوع کاربری ملک <span className="text-rose-500">*</span>
            </label>
            <select
              id="property-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none"
            >
              <option value="APARTMENT">آپارتمان مسکونی</option>
              <option value="VILLA">ویلا و باغ‌ویلا</option>
              <option value="LAND">زمین و کلنگی</option>
              <option value="OFFICE">دفتر کار و اداری</option>
              <option value="SHOP">مغازه و تجاری</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="prop-title" className="block text-xs font-black text-slate-800 mb-2">
            عنوان آگهی <span className="text-rose-500">*</span>
          </label>
          <Input
            id="prop-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: آپارتمان ۱۲۰ متری نوساز روبه آفتاب در سعادت‌آباد"
            className="w-full text-xs font-medium"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <DollarSign className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-black text-slate-900">قیمت و شرایط مالی</h2>
        </div>

        {listingType === "SALE" ? (
          <div>
            <label htmlFor="prop-price" className="block text-xs font-black text-slate-800 mb-2">
              قیمت کل فروش (تومان) <span className="text-rose-500">*</span>
            </label>
            <Input
              id="prop-price"
              type="number"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="مثال: 12500000000"
              className="w-full text-xs font-medium"
            />
            {price && Number(price) > 0 && (
              <p className="text-[11px] font-bold text-amber-900 mt-1.5">
                معادل: {formatNumber(Number(price))} تومان
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="prop-deposit" className="block text-xs font-black text-slate-800 mb-2">
                مبلغ ودیعه / رهن (تومان) <span className="text-rose-500">*</span>
              </label>
              <Input
                id="prop-deposit"
                type="number"
                min="0"
                required
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="مثال: 500000000"
                className="w-full text-xs font-medium"
              />
              {deposit && Number(deposit) > 0 && (
                <p className="text-[11px] font-bold text-amber-900 mt-1.5">
                  معادل: {formatNumber(Number(deposit))} تومان
                </p>
              )}
            </div>

            <div>
              <label htmlFor="prop-rent" className="block text-xs font-black text-slate-800 mb-2">
                اجاره ماهیانه (تومان) <span className="text-rose-500">*</span>
              </label>
              <Input
                id="prop-rent"
                type="number"
                min="0"
                required
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="مثال: 18000000"
                className="w-full text-xs font-medium"
              />
              {monthlyRent && Number(monthlyRent) > 0 && (
                <p className="text-[11px] font-bold text-amber-900 mt-1.5">
                  معادل: {formatNumber(Number(monthlyRent))} تومان
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Maximize2 className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-black text-slate-900">مشخصات فنی و امکانات</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="prop-area" className="block text-xs font-black text-slate-800 mb-2">
              متراژ (متر مربع) <span className="text-rose-500">*</span>
            </label>
            <Input
              id="prop-area"
              type="number"
              min="1"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="مثال: 110"
              className="w-full text-xs font-medium"
            />
          </div>

          <div>
            <label htmlFor="prop-bedrooms" className="block text-xs font-black text-slate-800 mb-2">
              تعداد اتاق خواب
            </label>
            <Input
              id="prop-bedrooms"
              type="number"
              min="0"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              placeholder="2"
              className="w-full text-xs font-medium"
            />
          </div>

          <div>
            <label htmlFor="prop-bathrooms" className="block text-xs font-black text-slate-800 mb-2">
              تعداد حمام و سرویس
            </label>
            <Input
              id="prop-bathrooms"
              type="number"
              min="1"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              placeholder="1"
              className="w-full text-xs font-medium"
            />
          </div>

          <div>
            <label htmlFor="prop-floor" className="block text-xs font-black text-slate-800 mb-2">
              طبقه واحد
            </label>
            <Input
              id="prop-floor"
              type="number"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="مثال: 3"
              className="w-full text-xs font-medium"
            />
          </div>
        </div>

        <div>
          <label htmlFor="prop-year" className="block text-xs font-black text-slate-800 mb-2">
            سال ساخت (شمسی)
          </label>
          <Input
            id="prop-year"
            type="number"
            min="1300"
            max="1410"
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
            placeholder="مثال: 1401"
            className="w-full sm:w-1/2 text-xs font-medium"
          />
        </div>

        <div>
          <span className="block text-xs font-black text-slate-800 mb-3">امکانات اصلی ملک</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
                className="h-4 w-4 rounded accent-amber-500"
              />
              <span className="text-xs font-bold text-slate-800">پارکینگ سندی</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={elevator}
                onChange={(e) => setElevator(e.target.checked)}
                className="h-4 w-4 rounded accent-amber-500"
              />
              <span className="text-xs font-bold text-slate-800">آسانسور</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={storage}
                onChange={(e) => setStorage(e.target.checked)}
                className="h-4 w-4 rounded accent-amber-500"
              />
              <span className="text-xs font-bold text-slate-800">انباری اختصاصی</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={balcony}
                onChange={(e) => setBalcony(e.target.checked)}
                className="h-4 w-4 rounded accent-amber-500"
              />
              <span className="text-xs font-bold text-slate-800">بالکن / تراس</span>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <MapPin className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-black text-slate-900">موقعیت و آدرس</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="prop-city" className="block text-xs font-black text-slate-800 mb-2">
              شهر <span className="text-rose-500">*</span>
            </label>
            <Input
              id="prop-city"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="مثال: تهران، مشهد، اصفهان، شیراز..."
              className="w-full text-xs font-medium"
            />
          </div>

          <div>
            <label htmlFor="prop-district" className="block text-xs font-black text-slate-800 mb-2">
              منطقه یا محله
            </label>
            <Input
              id="prop-district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="مثال: سعادت‌آباد، نیاوران، سجاد..."
              className="w-full text-xs font-medium"
            />
          </div>
        </div>

        <div>
          <label htmlFor="prop-address" className="block text-xs font-black text-slate-800 mb-2">
            آدرس دقیق ملک <span className="text-rose-500">*</span>
          </label>
          <Input
            id="prop-address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="مثال: خیابان سرو غربی، کوچه نسترن، پلاک ۱۲"
            className="w-full text-xs font-medium"
          />
        </div>

        <div>
          <label htmlFor="prop-desc" className="block text-xs font-black text-slate-800 mb-2">
            توضیحات و مزایای ملک <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="prop-desc"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="درباره نورگیری، وضعیت سند، بازسازی، دسترسی‌ها و شرایط ویژه ملک توضیح دهید..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Upload className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-black text-slate-900">تصاویر ملک</h2>
        </div>

        <div className="space-y-4">
          <label className="block w-full rounded-2xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/50 hover:bg-amber-50/20 p-8 text-center cursor-pointer transition-all">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Upload className="h-6 w-6 stroke-[2]" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {isUploading ? "در حال آپلود تصاویر..." : "انتخاب یا کشیدن تصاویر ملک به اینجا"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  فرمت‌های مجاز: JPG, PNG, WebP (حداکثر ۵ مگابایت برای هر تصویر)
                </p>
              </div>
            </div>
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                  <Image src={imgUrl} alt={`تصویر ملک ${idx + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 left-1.5 h-6 w-6 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 right-1.5 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black">
                      تصویر اصلی
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-black text-slate-900">مشخصات تماس مالک / نماینده</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="owner-name" className="block text-xs font-black text-slate-800 mb-2">
              نام و نام خانوادگی مالک یا وکیل
            </label>
            <Input
              id="owner-name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="مثال: علیرضا رستمی"
              className="w-full text-xs font-medium"
            />
          </div>

          <div>
            <label htmlFor="owner-phone" className="block text-xs font-black text-slate-800 mb-2">
              شماره تلفن همراه <span className="text-rose-500">*</span>
            </label>
            <Input
              id="owner-phone"
              type="tel"
              dir="ltr"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="09121234567"
              className="w-full text-xs font-medium text-left"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={isSubmitting || isUploading}
          className="w-full py-4 text-sm font-black shadow-lg shadow-amber-500/20"
          rightIcon={
            isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )
          }
        >
          {isSubmitting ? "در حال ثبت آگهی در سامانه..." : "تأیید و انتشار رایگان آگهی ملک"}
        </Button>
      </div>
    </form>
  );
}
