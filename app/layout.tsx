import type { Metadata } from "next";
import { vazirmatn } from "./fonts";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "مسکن پلاس | سامانه جامع خرید، فروش، رهن و اجاره ملک",
    template: "%s | مسکن پلاس",
  },
  description:
    "سامانه تخصصی خرید، فروش، رهن و اجاره آپارتمان، ویلا، ملک اداری، تجاری و زمین در سراسر کشور با بهترین قیمت و دسترسی آسان به مشاوران املاک.",
  keywords: [
    "خرید ملک",
    "فروش آپارتمان",
    "رهن و اجاره خانه",
    "املاک تهران",
    "خرید ویلا",
    "مشاور املاک",
    "اجاره مغازه",
  ],
  authors: [{ name: "مسکن پلاس" }],
  creator: "مسکن پلاس",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "مسکن پلاس | سامانه جامع خرید، فروش، رهن و اجاره ملک",
    description: "سامانه تخصصی املاک و مستغلات در سراسر کشور",
    locale: "fa_IR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
