import { Suspense, type ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CompareFloatingBar } from "@/components/site/CompareFloatingBar";

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-slate-900" />
          <div className="h-6 w-24 rounded bg-slate-200 animate-pulse" />
        </div>
      </div>
    </header>
  );
}

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<HeaderFallback />}>
        <SiteHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Suspense fallback={null}>
        <CompareFloatingBar />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
