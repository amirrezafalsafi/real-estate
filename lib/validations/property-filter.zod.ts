import { z } from "zod";

export const propertySortEnum = z.enum([
  "newest",
  "cheapest",
  "most_expensive",
  "largest",
]);

export type PropertySortOption = z.infer<typeof propertySortEnum>;

export const propertyFilterQuerySchema = z.object({
  query: z.string().trim().optional(),
  search: z.string().trim().optional(),
  listingType: z.enum(["SALE", "RENT"]).optional(),
  propertyType: z
    .enum(["APARTMENT", "VILLA", "LAND", "OFFICE", "SHOP"])
    .optional(),
  city: z.string().trim().optional(),
  district: z.string().trim().optional(),

  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),

  minArea: z.coerce.number().min(0).optional(),
  maxArea: z.coerce.number().min(0).optional(),

  bedrooms: z.coerce.number().min(0).optional(),

  parking: z
    .preprocess((val) => val === "true" || val === true || val === "1", z.boolean())
    .optional(),
  elevator: z
    .preprocess((val) => val === "true" || val === true || val === "1", z.boolean())
    .optional(),
  storage: z
    .preprocess((val) => val === "true" || val === true || val === "1", z.boolean())
    .optional(),
  balcony: z
    .preprocess((val) => val === "true" || val === true || val === "1", z.boolean())
    .optional(),

  sort: propertySortEnum.default("newest").optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

export type PropertyFilterQuery = z.infer<typeof propertyFilterQuerySchema>;
