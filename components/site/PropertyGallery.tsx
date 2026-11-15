"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, X, Maximize2 } from "lucide-react";
import { toPersianDigits } from "@/lib/format";

interface PropertyGalleryProps {
  images: { id: string; url: string; order: number }[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const fallbackImages = [
    {
      id: "fallback-1",
      url: "/images/properties/prop-1.webp",
      order: 0,
    },
  ];

  const galleryList = images.length > 0 ? images : fallbackImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryList.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev < galleryList.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, galleryList.length]);

  const activeImage = galleryList[currentIndex] || galleryList[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < galleryList.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryList.length - 1));
  };

  return (
    <div className="space-y-3">
      <div className="group relative aspect-16/10 w-full overflow-hidden rounded-3xl bg-slate-900 shadow-md">
        <Image
          src={activeImage.url}
          alt={`${title} - تصویر ${currentIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover object-center cursor-pointer transition-transform duration-500 group-hover:scale-102"
          onClick={() => setIsLightboxOpen(true)}
        />

        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-xl bg-slate-950/80 px-3.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md hover:bg-slate-900 transition-all select-none"
        >
          <Maximize2 className="h-4 w-4 text-amber-400" />
          <span>مشاهده بزرگ‌تر ({toPersianDigits(galleryList.length)} تصویر)</span>
        </button>

        {galleryList.length > 1 && (
          <div className="pointer-events-none absolute inset-y-0 inset-x-3 flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/70 text-white shadow-md backdrop-blur-xs hover:bg-slate-900 transition-all"
              aria-label="تصویر قبلی"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/70 text-white shadow-md backdrop-blur-xs hover:bg-slate-900 transition-all"
              aria-label="تصویر بعدی"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>

      {galleryList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {galleryList.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-16/10 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                currentIndex === idx
                  ? "border-amber-500 ring-2 ring-amber-400/30 scale-102"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} - بندانگشتی ${idx + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >

          <div className="absolute top-5 right-5 left-5 flex items-center justify-between text-white z-10">
            <span className="text-xs sm:text-sm font-bold bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800">
              تصویر {toPersianDigits(currentIndex + 1)} از {toPersianDigits(galleryList.length)}
            </span>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              aria-label="بستن"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div
            className="relative max-h-[85vh] max-w-[90vw] aspect-16/10 w-full overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage.url}
              alt={title}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {galleryList.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute right-5 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-all"
                aria-label="تصویر قبلی"
              >
                <ChevronRight className="h-7 w-7" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute left-5 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-all"
                aria-label="تصویر بعدی"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PropertyGallery;
