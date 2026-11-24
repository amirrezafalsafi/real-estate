"use client";

import { Suspense } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import ErrorContent from "./(site)/error";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-20 border-b border-slate-200 bg-white" />}>
        <SiteHeader />
      </Suspense>
      <main className="flex-1 flex items-center justify-center">
        <ErrorContent error={error} reset={reset} />
      </main>
      <SiteFooter />
    </div>
  );
}
