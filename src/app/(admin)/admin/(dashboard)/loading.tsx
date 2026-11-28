export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse text-right">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-2">
          <div className="h-7 w-60 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-80 rounded bg-slate-200/80 dark:bg-slate-800/60" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-12 rounded bg-slate-200/80 dark:bg-slate-800/60" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-32 rounded bg-slate-200/70 dark:bg-slate-800/50" />
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/70 dark:bg-blue-950/20 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 w-48 rounded-lg bg-blue-200 dark:bg-blue-900/60" />
          <div className="h-3 w-72 rounded bg-blue-100 dark:bg-blue-900/40" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-blue-600/20 dark:bg-blue-600/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="h-5 w-44 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-20 rounded bg-slate-200/80 dark:bg-slate-800/60" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/50 p-3 flex items-center justify-between">
                <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-24 rounded bg-slate-200/80 dark:bg-slate-800/60" />
                <div className="h-6 w-16 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-20 rounded bg-slate-200/80 dark:bg-slate-800/60" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/50 p-3 flex items-center justify-between">
                <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-20 rounded bg-slate-200/80 dark:bg-slate-800/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
