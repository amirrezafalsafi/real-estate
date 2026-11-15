import { PropertyCardSkeleton } from "@/components/site/PropertyCard";

export default function PropertiesLoading() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start text-right">
        <div className="hidden lg:block w-72 shrink-0 h-140 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-xs animate-pulse">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="h-6 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-9 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
              <div className="h-9 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>
        </div>

        <div className="flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs animate-pulse">
            <div className="space-y-2">
              <div className="h-5 w-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-28 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
            <div className="h-9 w-32 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
