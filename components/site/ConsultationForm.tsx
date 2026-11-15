"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneCall, CheckCircle2, AlertCircle } from "lucide-react";

interface ConsultationFormProps {
  propertyId?: string;
  submitText?: string;
  placeholderMessage?: string;
  compact?: boolean;
}

export function ConsultationForm({
  propertyId,
  submitText = "ثبت و دریافت مشاوره رایگان",
  placeholderMessage,
  compact = false,
}: ConsultationFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");
    setFeedbackMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          message,
          propertyId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setFeedbackMessage(data.error || "خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.");
      } else {
        setStatus("success");
        setFeedbackMessage(data.message || "درخواست شما با موفقیت ثبت شد.");
        setName("");
        setPhone("");
        setMessage("");
      }
    } catch {
      setStatus("error");
      setFeedbackMessage("خطا در برقراری ارتباط با سرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right">
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition-colors">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3.5 text-xs font-semibold text-rose-800 dark:text-rose-300 transition-colors">
          <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      <div className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        <Input
          label="نام و نام خانوادگی"
          placeholder="مثال: رضا صادقی"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="شماره موبایل"
          placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          dir="ltr"
          className="text-left"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          توضیحات یا پیام شما
        </label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            placeholderMessage ||
            "مثال: تمایل به هماهنگی برای بازدید حضوری در روزهای آخر هفته دارم..."
          }
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        rightIcon={<PhoneCall className="h-4 w-4" />}
        className="w-full"
      >
        {submitText}
      </Button>
    </form>
  );
}

export default ConsultationForm;
