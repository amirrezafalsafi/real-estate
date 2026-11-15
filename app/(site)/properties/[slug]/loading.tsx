export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 pb-20 transition-colors animate-pulse">
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 rounded-lg bg-blue-100 dark:bg-blue-950/60" />
              <div className="h-6 w-16 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-8 w-72 sm:w-96 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-4">
              <div className="h-4 w-48 rounded bg-slate-100 dark:bg-slate-800/60" />
              <div className="h-4 w-24 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <div className="aspect-16/10 w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />

            <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded bg-blue-200/70 dark:bg-blue-900/60" />
                  <div className="h-8 w-44 rounded-lg bg-blue-200 dark:bg-blue-900/80" />
                </div>
                <div className="h-12 w-32 rounded-xl bg-white/80 dark:bg-slate-800/80" />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
              <div className="h-5 w-36 rounded-lg bg-slate-200 dark:bg-slate-800 pb-2 border-b border-slate-100 dark:border-slate-800" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3" />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <div className="h-5 w-44 rounded-lg bg-slate-200 dark:bg-slate-800 pb-2 border-b border-slate-100 dark:border-slate-800" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
                <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800/60" />
                <div className="h-4 w-4/6 rounded bg-slate-100 dark:bg-slate-800/60" />
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-lg">
              <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="h-5 w-28 rounded bg-blue-100 dark:bg-blue-950/60" />
                <div className="h-6 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-56 rounded bg-slate-100 dark:bg-slate-800/60" />
              </div>

              <div className="space-y-3">
                <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
                <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
                <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
                <div className="h-11 rounded-xl bg-blue-600/30 dark:bg-blue-600/40" />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
                <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
