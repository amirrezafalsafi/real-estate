export default function PropertiesLoading() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start text-right animate-pulse">
        <div className="hidden lg:block w-72 shrink-0 h-140 rounded-3xl bg-slate-200/80" />

        <div className="flex-1 w-full space-y-6">
          <div className="h-16 rounded-3xl bg-slate-200/80" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3 p-4"
              >
                <div className="aspect-16/10 w-full rounded-xl bg-slate-200" />
                <div className="h-5 w-3/4 rounded-lg bg-slate-200" />
                <div className="h-4 w-1/2 rounded-lg bg-slate-100" />
                <div className="h-8 rounded-xl bg-slate-100" />
                <div className="h-6 w-1/3 rounded-lg bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
