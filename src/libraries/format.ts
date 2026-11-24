
const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toPersianDigits(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  return str
    .replace(/[0-9]/g, (w) => PERSIAN_DIGITS[Number(w)] ?? w)
    .replace(/[\u0660-\u0669]/g, (w) => PERSIAN_DIGITS[ARABIC_DIGITS.indexOf(w)] ?? w);
}

export function toEnglishDigits(value: string | null | undefined): string {
  if (!value) return "";
  let str = String(value);
  for (let i = 0; i < 10; i++) {
    str = str.replaceAll(PERSIAN_DIGITS[i], String(i)).replaceAll(ARABIC_DIGITS[i], String(i));
  }
  return str;
}

export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const cleanNumber = typeof value === "number" ? value : Number(toEnglishDigits(String(value)));
  if (Number.isNaN(cleanNumber)) return "";

  return new Intl.NumberFormat("fa-IR").format(cleanNumber);
}

export function formatPrice(
  amount: number | string | null | undefined,
  unit: string = "تومان",
  options?: { fallbackToNegotiable?: boolean }
): string {
  if (amount === null || amount === undefined || amount === "") {
    return options?.fallbackToNegotiable ? "توافقی" : `۰ ${unit}`;
  }

  const num = typeof amount === "number" ? amount : Number(toEnglishDigits(String(amount)));
  if (Number.isNaN(num)) return "";

  if (num === 0 && options?.fallbackToNegotiable) {
    return "توافقی";
  }

  return `${formatNumber(num)} ${unit}`;
}

export function formatMortgageAndRent(
  deposit: number | null | undefined,
  monthlyRent: number | null | undefined
): { depositFormatted: string; rentFormatted: string; combined: string } {
  const depositFormatted = formatPrice(deposit ?? 0, "تومان", { fallbackToNegotiable: true });
  const rentFormatted = formatPrice(monthlyRent ?? 0, "تومان", { fallbackToNegotiable: true });

  return {
    depositFormatted,
    rentFormatted,
    combined: `ودیعه: ${depositFormatted} / اجاره ماهانه: ${rentFormatted}`,
  };
}

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
