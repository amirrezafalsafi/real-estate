import { toEnglishDigits } from "../to-persian-digits";

export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const cleanNumber = typeof value === "number" ? value : Number(toEnglishDigits(String(value)));
  if (Number.isNaN(cleanNumber)) return "";

  return new Intl.NumberFormat("fa-IR").format(cleanNumber);
}
