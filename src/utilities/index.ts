export * from "./to-persian-digits";
export * from "./format-number";
export * from "./format-price";
export * from "./cn";
export * from "./slug";

import { toPersianDigits, toEnglishDigits } from "./to-persian-digits";
import { formatNumber } from "./format-number";

export function formatArea(area: number | string | null | undefined): string {
  if (!area) return "";
  return `${formatNumber(area)} متر مربع`;
}

export function formatBedrooms(count: number | null | undefined): string {
  if (count === null || count === undefined) return "";
  if (count === 0) return "سوئیت (بدون خواب)";
  return `${toPersianDigits(count)} خواب`;
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const english = toEnglishDigits(phone).replace(/\D/g, "");
  if (english.length === 11 && english.startsWith("09")) {
    const formatted = `${english.slice(0, 4)}-${english.slice(4, 7)}-${english.slice(7)}`;
    return toPersianDigits(formatted);
  }
  return toPersianDigits(phone);
}

export function formatJalaliDate(
  date: Date | string | number | null | undefined,
  options?: { includeTime?: boolean; format?: "full" | "medium" | "short" }
): string {
  if (!date) return "";
  const d = typeof date === "object" ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  try {
    if (options?.includeTime) {
      return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        dateStyle: options?.format || "medium",
        timeStyle: "short",
      }).format(d);
    }

    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      dateStyle: options?.format || "medium",
    }).format(d);
  } catch {
    return "";
  }
}
