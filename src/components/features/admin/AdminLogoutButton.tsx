"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 hover:text-rose-700 dark:hover:text-rose-300 transition-colors disabled:opacity-50"
      title="خروج از حساب مدیریت"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-rose-600 dark:text-rose-400" />
      ) : (
        <LogOut className="h-4 w-4 text-rose-600 dark:text-rose-400" />
      )}
      <span>خروج</span>
    </button>
  );
}

export default AdminLogoutButton;
