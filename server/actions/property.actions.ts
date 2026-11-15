"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/admin-auth";
import { propertyZodSchema, type PropertyInput } from "@/lib/validations/property.zod";
import { createSlug } from "@/lib/utils";
import type { PropertyStatus } from "@/types";

async function ensureAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    throw new Error("دسترسی غیرمجاز: لطفاً ابتدا وارد حساب مدیریت شوید.");
  }

  const session = await verifyAdminToken(token);
  if (!session) {
    throw new Error("نشست کاری منقضی یا نامعتبر است.");
  }

  return session;
}

async function generateUniqueSlug(title: string, currentId?: string): Promise<string> {
  const baseSlug = createSlug(title) || `property-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.property.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || (currentId && existing.id === currentId)) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function createPropertyAction(data: PropertyInput) {
  try {
    await ensureAdminSession();

    const validated = propertyZodSchema.parse(data);

    const slug = await generateUniqueSlug(validated.slug || validated.title);

    const property = await prisma.property.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        listingType: validated.listingType,
        propertyType: validated.propertyType,
        price: validated.price,
        deposit: validated.deposit,
        monthlyRent: validated.monthlyRent,
        area: validated.area,
        bedrooms: validated.bedrooms,
        bathrooms: validated.bathrooms,
        floor: validated.floor,
        yearBuilt: validated.yearBuilt,
        parking: validated.parking,
        elevator: validated.elevator,
        storage: validated.storage,
        balcony: validated.balcony,
        city: validated.city,
        district: validated.district,
        address: validated.address,
        featured: validated.featured,
        status: validated.status,
        images: {
          create: (validated.images || []).map((img, index) => ({
            url: img.url,
            order: img.order !== undefined ? img.order : index,
          })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath("/admin");
    revalidatePath("/admin/properties");

    return {
      success: true,
      message: "ملک با موفقیت در سامانه ثبت شد.",
      data: property,
    };
  } catch (error: unknown) {
    console.error("createPropertyAction error:", error);
    const message = error instanceof Error ? error.message : "خطا در ثبت اطلاعات ملک.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function updatePropertyAction(id: string, data: PropertyInput) {
  try {
    await ensureAdminSession();

    if (!id) {
      throw new Error("شناسه ملک نامعتبر است.");
    }

    const validated = propertyZodSchema.parse(data);

    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      throw new Error("ملک مورد نظر یافت نشد.");
    }

    const targetSlug = validated.slug && validated.slug.trim() !== "" ? validated.slug : validated.title;
    const slug = await generateUniqueSlug(targetSlug, id);

    const updatedProperty = await prisma.$transaction(async (tx) => {

      await tx.propertyImage.deleteMany({
        where: { propertyId: id },
      });

      return tx.property.update({
        where: { id },
        data: {
          title: validated.title,
          slug,
          description: validated.description,
          listingType: validated.listingType,
          propertyType: validated.propertyType,
          price: validated.price,
          deposit: validated.deposit,
          monthlyRent: validated.monthlyRent,
          area: validated.area,
          bedrooms: validated.bedrooms,
          bathrooms: validated.bathrooms,
          floor: validated.floor,
          yearBuilt: validated.yearBuilt,
          parking: validated.parking,
          elevator: validated.elevator,
          storage: validated.storage,
          balcony: validated.balcony,
          city: validated.city,
          district: validated.district,
          address: validated.address,
          featured: validated.featured,
          status: validated.status,
          images: {
            create: (validated.images || []).map((img, index) => ({
              url: img.url,
              order: img.order !== undefined ? img.order : index,
            })),
          },
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath(`/properties/${slug}`);
    if (existingProperty.slug !== slug) {
      revalidatePath(`/properties/${existingProperty.slug}`);
    }
    revalidatePath("/admin");
    revalidatePath("/admin/properties");

    return {
      success: true,
      message: "تغییرات ملک با موفقیت ذخیره شد.",
      data: updatedProperty,
    };
  } catch (error: unknown) {
    console.error("updatePropertyAction error:", error);
    const message = error instanceof Error ? error.message : "خطا در ویرایش اطلاعات ملک.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function deletePropertyAction(id: string) {
  try {
    await ensureAdminSession();

    if (!id) {
      throw new Error("شناسه ملک الزامی است.");
    }

    const existing = await prisma.property.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!existing) {
      throw new Error("ملک مورد نظر یافت نشد.");
    }

    await prisma.$transaction(async (tx) => {

      await tx.propertyImage.deleteMany({
        where: { propertyId: id },
      });

      await tx.inquiry.updateMany({
        where: { propertyId: id },
        data: { propertyId: null },
      });

      await tx.property.delete({
        where: { id },
      });
    });

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath(`/properties/${existing.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/properties");

    return {
      success: true,
      message: "ملک با موفقیت حذف گردید.",
    };
  } catch (error: unknown) {
    console.error("deletePropertyAction error:", error);
    const message = error instanceof Error ? error.message : "خطا در حذف ملک.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function togglePropertyStatusAction(id: string, status: PropertyStatus) {
  try {
    await ensureAdminSession();

    const updated = await prisma.property.update({
      where: { id },
      data: { status },
      select: { slug: true, status: true },
    });

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath(`/properties/${updated.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/properties");

    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    console.error("togglePropertyStatusAction error:", error);
    const message = error instanceof Error ? error.message : "خطا در تغییر وضعیت ملک.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function togglePropertyFeaturedAction(id: string, featured: boolean) {
  try {
    await ensureAdminSession();

    const updated = await prisma.property.update({
      where: { id },
      data: { featured },
      select: { slug: true, featured: true },
    });

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath(`/properties/${updated.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/properties");

    return {
      success: true,
      data: updated,
    };
  } catch (error: unknown) {
    console.error("togglePropertyFeaturedAction error:", error);
    const message = error instanceof Error ? error.message : "خطا در تغییر برچسب ویژه.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function submitPublicPropertyAction(
  data: Omit<PropertyInput, "featured" | "status"> & {
    featured?: boolean;
    status?: PropertyStatus;
    contactName?: string;
    contactPhone?: string;
  }
) {
  try {
    const validated = propertyZodSchema.parse({
      ...data,
      featured: false,
      status: "ACTIVE",
    });
    const slug = await generateUniqueSlug(validated.slug || validated.title);

    const property = await prisma.property.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        listingType: validated.listingType,
        propertyType: validated.propertyType,
        price: validated.listingType === "SALE" ? validated.price : null,
        deposit: validated.listingType === "RENT" ? validated.deposit : null,
        monthlyRent: validated.listingType === "RENT" ? validated.monthlyRent : null,
        area: validated.area,
        bedrooms: validated.bedrooms,
        bathrooms: validated.bathrooms,
        floor: validated.floor ?? null,
        yearBuilt: validated.yearBuilt ?? null,
        parking: validated.parking,
        elevator: validated.elevator,
        storage: validated.storage,
        balcony: validated.balcony,
        city: validated.city,
        district: validated.district ?? null,
        address: validated.address ?? null,
        featured: false,
        status: "ACTIVE",
        images: {
          create:
            validated.images && validated.images.length > 0
              ? validated.images.map((img, index) => ({
                  url: img.url,
                  order: img.order ?? index,
                }))
              : [
                  {
                    url: "/images/properties/prop-1.webp",
                    order: 0,
                  },
                ],
        },
      },
    });

    if (data.contactPhone && data.contactPhone.trim()) {
      await prisma.inquiry.create({
        data: {
          name: data.contactName?.trim() || "مالک آگهی‌دهنده",
          phone: data.contactPhone.trim(),
          message: `ثبت آگهی جدید: «${property.title}» - شهر: ${property.city}`,
          propertyId: property.id,
          isRead: false,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath("/sitemap.xml");

    return { success: true, slug: property.slug, id: property.id };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "خطا در ثبت آگهی. لطفاً دوباره تلاش فرمایید." };
  }
}
