"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("مشاوره خرید یا سرمایه‌گذاری");
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
      const formattedMessage = `[موضوع: ${subject}] ${message}`.trim();

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: formattedMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setFeedbackMessage(data.error || "خطا در ثبت پیام. لطفاً اطلاعات را بررسی کرده و مجدداً تلاش فرمایید.");
      } else {
        setStatus("success");
        setFeedbackMessage("پیام شما با موفقیت ثبت گردید. کارشناسان مسکن پلاس در اسرع وقت با شما تماس خواهند گرفت.");
        setName("");
        setPhone("");
        setMessage("");
      }
    } catch {
      setStatus("error");
      setFeedbackMessage("خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی فرمایید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "success" && (
        <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-xs sm:text-sm font-bold animate-in fade-in duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{feedbackMessage}</div>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-xs sm:text-sm font-bold animate-in fade-in duration-300">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{feedbackMessage}</div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-black text-slate-800 mb-2">
            نام و نام خانوادگی <span className="text-rose-500">*</span>
          </label>
          <Input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: سهراب سپهری"
            className="w-full text-xs font-medium"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-xs font-black text-slate-800 mb-2">
            شماره موبایل <span className="text-rose-500">*</span>
          </label>
          <Input
            id="contact-phone"
            type="tel"
            dir="ltr"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09121234567"
            className="w-full text-xs font-medium text-left"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-xs font-black text-slate-800 mb-2">
          موضوع درخواست یا پیام
        </label>
        <select
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none"
        >
          <option value="مشاوره خرید یا سرمایه‌گذاری">مشاوره خرید یا سرمایه‌گذاری ملک</option>
          <option value="مشاوره فروش یا ثبت آگهی">مشاوره فروش یا واگذاری ملک</option>
          <option value="رهن و اجاره">رهن و اجاره واحد مسکونی یا اداری</option>
          <option value="مشاوره حقوقی قرارداد">مشاوره حقوقی و استعلام اسناد ثبتی</option>
          <option value="انتقادات و پیشنهادات">انتقادات، پیشنهادات و پشتیبانی سامانه</option>
          <option value="سایر موارد">سایر موضوعات</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-black text-slate-800 mb-2">
          شرح درخواست یا پیام شما <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="توضیحات تکمیلی، شهر و منطقه مورد نظر یا زمان مناسب برای تماس را مرقوم فرمایید..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none transition-colors resize-none"
        />
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        disabled={isLoading}
        className="w-full font-black text-sm shadow-md shadow-amber-500/20"
        rightIcon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      >
        {isLoading ? "در حال ارسال پیام..." : "ارسال پیام و ثبت درخواست مشاوره"}
      </Button>
    </form>
  );
}
