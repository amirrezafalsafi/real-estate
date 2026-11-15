import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { ListingType, PropertyType, PropertyStatus } from "@/types";
import type { PropertySortOption } from "@/lib/validations/property-filter.zod";
import { createSlug } from "@/lib/utils";
import type { PropertyFormData } from "@/lib/validations/property.schema";

export interface PropertyFiltersInput {
  search?: string;
  query?: string;
  listingType?: ListingType;
  propertyType?: PropertyType;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  parking?: boolean;
  elevator?: boolean;
  storage?: boolean;
  balcony?: boolean;
  featured?: boolean;
  status?: PropertyStatus;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export async function getProperties(
  filters: PropertyFiltersInput = {},
  pagination: PaginationInput = {},
  sort: PropertySortOption = "newest"
) {
  const {
    search,
    query,
    listingType,
    propertyType,
    city,
    district,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    bedrooms,
    parking,
    elevator,
    storage,
    balcony,
    featured,
    status = "ACTIVE",
  } = filters;

  const page = Math.max(1, pagination.page || 1);
  const limit = Math.max(1, Math.min(100, pagination.limit || 12));
  const skip = (page - 1) * limit;

  const where: Prisma.PropertyWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (listingType) {
    where.listingType = listingType;
  }

  if (propertyType) {
    where.propertyType = propertyType;
  }

  if (featured !== undefined && featured !== null) {
    where.featured = featured;
  }

  if (city) {
    where.city = { contains: city };
  }

  if (district) {
    where.district = { contains: district };
  }

  if (bedrooms !== undefined && bedrooms !== null && bedrooms > 0) {
    where.bedrooms = { gte: bedrooms };
  }

  if (parking) where.parking = true;
  if (elevator) where.elevator = true;
  if (storage) where.storage = true;
  if (balcony) where.balcony = true;

  if (minPrice !== undefined || maxPrice !== undefined) {
    if (listingType === "RENT") {
      where.deposit = {};
      if (minPrice !== undefined) where.deposit.gte = minPrice;
      if (maxPrice !== undefined) where.deposit.lte = maxPrice;
    } else {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
  }

  if (minArea !== undefined || maxArea !== undefined) {
    where.area = {};
    if (minArea !== undefined) where.area.gte = minArea;
    if (maxArea !== undefined) where.area.lte = maxArea;
  }

  const searchTerm = search || query;
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm } },
      { address: { contains: searchTerm } },
      { district: { contains: searchTerm } },
      { city: { contains: searchTerm } },
      { description: { contains: searchTerm } },
    ];
  }

  let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: "desc" };

  switch (sort) {
    case "cheapest":
      if (listingType === "RENT") {
        orderBy = { deposit: "asc" };
      } else {
        orderBy = { price: "asc" };
      }
      break;

    case "most_expensive":
      if (listingType === "RENT") {
        orderBy = { deposit: "desc" };
      } else {
        orderBy = { price: "desc" };
      }
      break;

    case "largest":
      orderBy = { area: "desc" };
      break;

    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPropertyBySlug(slug: string) {
  return prisma.property.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getSimilarProperties(
  propertyId: string,
  city: string,
  propertyType: PropertyType,
  limit: number = 3
) {
  const exactMatches = await prisma.property.findMany({
    where: {
      id: { not: propertyId },
      status: "ACTIVE",
      city,
      propertyType,
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (exactMatches.length >= limit) {
    return exactMatches;
  }

  const existingIds = [propertyId, ...exactMatches.map((p) => p.id)];
  const remainingLimit = limit - exactMatches.length;

  const additionalMatches = await prisma.property.findMany({
    where: {
      id: { notIn: existingIds },
      status: "ACTIVE",
      OR: [{ city }, { propertyType }],
    },
    take: remainingLimit,
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  return [...exactMatches, ...additionalMatches];
}

export async function getFeaturedProperties(limit: number = 6) {
  return prisma.property.findMany({
    where: {
      featured: true,
      status: "ACTIVE",
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getPropertiesByIds(ids: string[]) {
  if (!ids || ids.length === 0) return [];

  const properties = await prisma.property.findMany({
    where: {
      id: { in: ids },
      status: "ACTIVE",
    },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  const idMap = new Map(properties.map((p) => [p.id, p]));
  return ids.map((id) => idMap.get(id)).filter(Boolean) as typeof properties;
}

export async function getFilterOptions() {
  const [citiesData, priceAgg, rentAgg, areaAgg] = await Promise.all([
    prisma.property.findMany({
      where: { status: "ACTIVE" },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    }),
    prisma.property.aggregate({
      where: { status: "ACTIVE", listingType: "SALE", price: { not: null } },
      _min: { price: true },
      _max: { price: true },
    }),
    prisma.property.aggregate({
      where: { status: "ACTIVE", listingType: "RENT", deposit: { not: null } },
      _min: { deposit: true },
      _max: { deposit: true },
    }),
    prisma.property.aggregate({
      where: { status: "ACTIVE" },
      _min: { area: true },
      _max: { area: true },
    }),
  ]);

  return {
    cities: citiesData.map((c) => c.city),
    priceRange: {
      sale: {
        min: priceAgg._min.price ?? 0,
        max: priceAgg._max.price ?? 100000000000,
      },
      rent: {
        min: rentAgg._min.deposit ?? 0,
        max: rentAgg._max.deposit ?? 10000000000,
      },
    },
    areaRange: {
      min: areaAgg._min.area ?? 0,
      max: areaAgg._max.area ?? 2000,
    },
  };
}

export async function getCategoryCounts() {
  const [apartmentCount, villaCount, landCount, commercialCount, totalActive] =
    await Promise.all([
      prisma.property.count({ where: { status: "ACTIVE", propertyType: "APARTMENT" } }),
      prisma.property.count({ where: { status: "ACTIVE", propertyType: "VILLA" } }),
      prisma.property.count({ where: { status: "ACTIVE", propertyType: "LAND" } }),
      prisma.property.count({
        where: {
          status: "ACTIVE",
          propertyType: { in: ["OFFICE", "SHOP"] },
        },
      }),
      prisma.property.count({ where: { status: "ACTIVE" } }),
    ]);

  return {
    apartment: apartmentCount,
    villa: villaCount,
    land: landCount,
    commercial: commercialCount,
    total: totalActive,
  };
}

export async function createProperty(data: PropertyFormData) {
  const baseSlug = createSlug(data.title);
  const uniqueSuffix = Date.now().toString().slice(-5);
  const slug = `${baseSlug}-${uniqueSuffix}`;

  return prisma.property.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      listingType: data.listingType as "SALE" | "RENT",
      propertyType: data.propertyType as "APARTMENT" | "VILLA" | "LAND" | "OFFICE" | "SHOP",
      price: data.price ?? null,
      deposit: data.deposit ?? null,
      monthlyRent: data.monthlyRent ?? null,
      area: data.area,
      bedrooms: data.bedrooms ?? 0,
      bathrooms: data.bathrooms ?? 1,
      floor: data.floor ?? null,
      yearBuilt: data.yearBuilt ?? null,
      parking: data.parking ?? false,
      elevator: data.elevator ?? false,
      storage: data.storage ?? false,
      balcony: data.balcony ?? false,
      city: data.city,
      district: data.district ?? null,
      address: data.address ?? null,
      featured: data.featured ?? false,
      status: (data.status as "ACTIVE" | "SOLD" | "RENTED" | "HIDDEN") ?? "ACTIVE",
    },
  });
}
