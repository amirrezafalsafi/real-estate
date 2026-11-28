import React from "react";
import type { Metadata } from "next";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const metadata: Metadata = {
  title: "ثبت ملک جدید | پنل مدیریت",
  description: "افزودن و انتشار مشخصات ملک جدید در سامانه سرپناه",
};

export default function NewPropertyPage() {
  return <PropertyForm />;
}
