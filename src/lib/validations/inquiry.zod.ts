import { z } from "zod";
import { toEnglishDigits } from "@/lib/format";

const IRANIAN_MOBILE_REGEX = /^(?:\+98|0098|0)?9\d{9}$/;

export const inquiryInputSchema = z.object({
  name: z
    .string({
      error: "نام و نام خانوادگی الزامی است",
    })
    .trim()
    .min(3, "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد")
    .max(80, "نام و نام خانوادگی نمی‌تواند بیش از ۸۰ کاراکتر باشد"),

  phone: z
    .string({
      error: "شماره تماس الزامی است",
    })
    .trim()
    .transform((val) => toEnglishDigits(val).replace(/\s+/g, ""))
    .refine(
      (val) => IRANIAN_MOBILE_REGEX.test(val),
      "شماره موبایل وارد شده معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"
    ),

  message: z
    .string({
      error: "متن پیام الزامی است",
    })
    .trim()
    .min(10, "متن پیام باید حداقل ۱۰ کاراکتر باشد")
    .max(1000, "متن پیام نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد"),

  propertyId: z.string().trim().optional().nullable(),
});

export type InquiryInput = z.infer<typeof inquiryInputSchema>;
