import * as yup from "yup";

export const propertySchema = yup.object({
  title: yup
    .string()
    .required("عنوان آگهی الزامی است")
    .min(5, "عنوان آگهی باید حداقل ۵ کاراکتر باشد")
    .max(120, "عنوان آگهی نمی‌تواند بیش از ۱۲۰ کاراکتر باشد"),

  description: yup
    .string()
    .required("توضیحات ملک الزامی است")
    .min(15, "توضیحات باید حداقل ۱۵ کاراکتر باشد"),

  listingType: yup
    .string()
    .required("نوع معامله را مشخص کنید")
    .oneOf(["SALE", "RENT"], "نوع معامله انتخاب شده نامعتبر است"),

  propertyType: yup
    .string()
    .required("نوع ملک را مشخص کنید")
    .oneOf(
      ["APARTMENT", "VILLA", "LAND", "OFFICE", "SHOP"],
      "نوع ملک انتخاب شده نامعتبر است"
    ),

  price: yup.number().when("listingType", {
    is: "SALE",
    then: (schema) =>
      schema
        .typeError("قیمت فروش باید عدد معتبر باشد")
        .required("قیمت کل برای املاک فروشی الزامی است")
        .min(0, "قیمت نمی‌تواند منفی باشد"),
    otherwise: (schema) => schema.nullable().strip(),
  }),

  deposit: yup.number().when("listingType", {
    is: "RENT",
    then: (schema) =>
      schema
        .typeError("مبلغ ودیعه باید عدد باشد")
        .required("مبلغ ودیعه (رهن) الزامی است")
        .min(0, "مبلغ ودیعه نمی‌تواند منفی باشد"),
    otherwise: (schema) => schema.nullable().strip(),
  }),

  monthlyRent: yup.number().when("listingType", {
    is: "RENT",
    then: (schema) =>
      schema
        .typeError("اجاره ماهانه باید عدد باشد")
        .required("مبلغ اجاره ماهانه الزامی است")
        .min(0, "اجاره ماهانه نمی‌تواند منفی باشد"),
    otherwise: (schema) => schema.nullable().strip(),
  }),

  area: yup
    .number()
    .typeError("متراژ باید عدد باشد")
    .required("متراژ ملک الزامی است")
    .positive("متراژ باید بزرگتر از صفر باشد"),

  bedrooms: yup
    .number()
    .typeError("تعداد خواب باید عدد باشد")
    .min(0, "تعداد خواب نمی‌تواند منفی باشد")
    .default(0),

  bathrooms: yup
    .number()
    .typeError("تعداد سرویس بهداشتی باید عدد باشد")
    .min(1, "حداقل ۱ سرویس بهداشتی الزامی است")
    .default(1),

  floor: yup.number().nullable().typeError("شماره طبقه باید عدد باشد"),
  yearBuilt: yup
    .number()
    .nullable()
    .typeError("سال ساخت باید عدد باشد")
    .min(1300, "سال ساخت نامعتبر است")
    .max(1410, "سال ساخت نامعتبر است"),

  parking: yup.boolean().default(false),
  elevator: yup.boolean().default(false),
  storage: yup.boolean().default(false),
  balcony: yup.boolean().default(false),

  city: yup.string().required("شهر الزامی است"),
  district: yup.string().nullable(),
  address: yup.string().nullable(),

  featured: yup.boolean().default(false),
  status: yup
    .string()
    .oneOf(["ACTIVE", "SOLD", "RENTED", "HIDDEN"])
    .default("ACTIVE"),
});

export type PropertyFormData = yup.InferType<typeof propertySchema>;

export const propertyFilterSchema = yup.object({
  query: yup.string().nullable(),
  listingType: yup.string().oneOf(["SALE", "RENT"]).nullable(),
  propertyType: yup
    .string()
    .oneOf(["APARTMENT", "VILLA", "LAND", "OFFICE", "SHOP"])
    .nullable(),
  status: yup.string().oneOf(["ACTIVE", "SOLD", "RENTED", "HIDDEN"]).nullable(),
  minPrice: yup.number().nullable(),
  maxPrice: yup.number().nullable(),
  minDeposit: yup.number().nullable(),
  maxDeposit: yup.number().nullable(),
  minRent: yup.number().nullable(),
  maxRent: yup.number().nullable(),
  minArea: yup.number().nullable(),
  maxArea: yup.number().nullable(),
  bedrooms: yup.number().nullable(),
  city: yup.string().nullable(),
  district: yup.string().nullable(),
  featured: yup.boolean().nullable(),
  page: yup.number().default(1),
  limit: yup.number().default(12),
});

export type PropertyFilterData = yup.InferType<typeof propertyFilterSchema>;
