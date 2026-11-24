import { z } from "zod";

export const propertyZodSchema = z
  .object({
    title: z
      .string()
      .min(3, "عنوان آگهی باید حداقل ۳ کاراکتر باشد")
      .max(150, "عنوان آگهی نمی‌تواند بیش از ۱۵۰ کاراکتر باشد"),

    slug: z.string().optional(),

    description: z
      .string()
      .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد"),

    listingType: z.enum(["SALE", "RENT"]),

    propertyType: z.enum(["APARTMENT", "VILLA", "LAND", "OFFICE", "SHOP"]),

    price: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number().min(0, "قیمت نمی‌تواند منفی باشد").optional()
    ),

    deposit: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number().min(0, "ودیعه نمی‌تواند منفی باشد").optional()
    ),

    monthlyRent: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number().min(0, "اجاره نمی‌تواند منفی باشد").optional()
    ),

    area: z.preprocess(
      (val) => Number(val),
      z.number().positive("متراژ باید بزرگتر از صفر باشد")
    ),

    bedrooms: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? 0 : Number(val)),
      z.number().min(0, "تعداد خواب نمی‌تواند منفی باشد")
    ),

    bathrooms: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? 1 : Number(val)),
      z.number().min(1, "حداقل ۱ سرویس بهداشتی الزامی است")
    ),

    floor: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number().optional()
    ),

    yearBuilt: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number().min(1300, "سال ساخت نامعتبر است").max(1450, "سال ساخت نامعتبر است").optional()
    ),

    parking: z.boolean().default(false),
    elevator: z.boolean().default(false),
    storage: z.boolean().default(false),
    balcony: z.boolean().default(false),

    city: z
      .string()
      .min(2, "نام شهر باید حداقل ۲ کاراکتر باشد"),

    district: z.string().optional().nullable(),

    address: z
      .string()
      .min(3, "آدرس باید حداقل ۳ کاراکتر باشد"),

    featured: z.boolean().default(false),
    status: z.enum(["ACTIVE", "SOLD", "RENTED", "HIDDEN"]).default("ACTIVE"),

    images: z
      .array(
        z.object({
          id: z.string().optional(),
          url: z.string().min(1, "آدرس تصویر الزامی است"),
          order: z.number().default(0),
        })
      )
      .default([]),
  })
  .refine(
    (data) => {
      if (data.listingType === "SALE") {
        return data.price !== undefined && data.price !== null && data.price >= 0;
      }
      return true;
    },
    {
      message: "برای املاک فروشی، وارد کردن قیمت کل الزامی است",
      path: ["price"],
    }
  )
  .refine(
    (data) => {
      if (data.listingType === "RENT") {
        return (
          data.deposit !== undefined &&
          data.deposit !== null &&
          data.deposit >= 0 &&
          data.monthlyRent !== undefined &&
          data.monthlyRent !== null &&
          data.monthlyRent >= 0
        );
      }
      return true;
    },
    {
      message: "برای املاک رهن و اجاره، مبالغ ودیعه و اجاره ماهانه الزامی است",
      path: ["deposit"],
    }
  );

export type PropertyInput = z.infer<typeof propertyZodSchema>;
