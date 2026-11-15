export type ListingType = "SALE" | "RENT";

export type PropertyType =
  | "APARTMENT"
  | "VILLA"
  | "LAND"
  | "OFFICE"
  | "SHOP";

export type PropertyStatus = "ACTIVE" | "SOLD" | "RENTED" | "HIDDEN";

export interface PropertyImageItem {
  id: string;
  url: string;
  order: number;
  propertyId: string;
}

export interface PropertyItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price?: number | null;
  deposit?: number | null;
  monthlyRent?: number | null;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number | null;
  yearBuilt?: number | null;
  parking: boolean;
  elevator: boolean;
  storage: boolean;
  balcony: boolean;
  city: string;
  district?: string | null;
  address?: string | null;
  featured: boolean;
  status: PropertyStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  images?: PropertyImageItem[];
}

export interface PropertyFilters {
  query?: string;
  listingType?: ListingType;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  minDeposit?: number;
  maxDeposit?: number;
  minRent?: number;
  maxRent?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  city?: string;
  district?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}
