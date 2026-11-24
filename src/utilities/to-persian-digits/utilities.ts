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
