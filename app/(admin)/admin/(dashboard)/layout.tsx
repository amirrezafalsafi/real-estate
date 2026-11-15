import { Suspense, type ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

function SidebarFallback() {
  return <aside className="w-64 shrink-0 border-l border-slate-800 bg-slate-950" />;
}

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Suspense fallback={<SidebarFallback />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900/40">
          {children}
        </main>
      </div>
    </div>
  );
}
