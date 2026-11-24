export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | bigint
  | { [key: string]: unknown }
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flatMap((input) => {
      if (!input) return [];
      if (typeof input === "object") {
        return Object.entries(input)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return [String(input)];
    })
    .filter(Boolean)
    .join(" ");
}
