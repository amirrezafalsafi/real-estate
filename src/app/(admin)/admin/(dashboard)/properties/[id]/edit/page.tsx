import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/PropertyForm";

interface EditPropertyProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "ویرایش آگهی ملک | پنل مدیریت",
  description: "ویرایش مشخصات، قیمت، امکانات و تصاویر ملک",
};

async function EditPropertyContent({ params }: EditPropertyProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!property) {
    notFound();
  }

  return <PropertyForm initialData={property} />;
}

export default function EditPropertyPage({ params }: EditPropertyProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-150 w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
        </div>
      }
    >
      <EditPropertyContent params={params} />
    </Suspense>
  );
}
