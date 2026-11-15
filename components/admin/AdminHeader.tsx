import React from "react";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { Shield, User } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-18 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Shield className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100">میز کار و پیشخوان مدیریت</h1>
          <p className="text-[11px] text-slate-500">کنترل املاک و درخواست‌های ثبت شده</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 text-right">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs">
            <User className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-200">مدیر ارشد سامانه</span>
            <span className="block text-[10px] text-slate-500">admin@maskanplus.ir</span>
          </div>
        </div>

        <AdminLogoutButton />
      </div>
    </header>
  );
}

export default AdminHeader;
