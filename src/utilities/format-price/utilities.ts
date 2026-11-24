import { toEnglishDigits } from "../to-persian-digits";
import { formatNumber } from "../format-number";

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
