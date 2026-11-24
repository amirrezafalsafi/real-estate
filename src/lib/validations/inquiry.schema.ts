import * as yup from "yup";

const IRANIAN_MOBILE_REGEX = /^(\+98|0)?9\d{9}$/;

export const inquirySchema = yup.object({
  fullName: yup
    .string()
    .required("نام و نام خانوادگی الزامی است")
    .min(3, "نام باید حداقل ۳ کاراکتر باشد"),

  phone: yup
    .string()
    .required("شماره تماس الزامی است")
    .matches(IRANIAN_MOBILE_REGEX, "شماره موبایل وارد شده معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),

  message: yup
    .string()
    .required("متن پیام یا درخواست الزامی است")
    .min(10, "پیام باید حداقل ۱۰ کاراکتر باشد")
    .max(500, "پیام نمی‌تواند بیش از ۵۰۰ کاراکتر باشد"),

  propertyId: yup.string().nullable(),
});

export type InquiryFormData = yup.InferType<typeof inquirySchema>;
