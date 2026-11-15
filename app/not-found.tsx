import { Suspense } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import NotFoundContent from "./(site)/not-found";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-app-bg text-app-text">
      <Suspense fallback={<div className="h-20 border-b border-slate-200/90 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95" />}>
        <SiteHeader />
      </Suspense>
      <main className="flex-1 flex items-center justify-center">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </div>
  );
}
