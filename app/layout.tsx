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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('maskan_theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-app-bg text-app-text antialiased selection:bg-blue-600 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
