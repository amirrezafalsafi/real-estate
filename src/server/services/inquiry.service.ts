import prisma from "@/lib/prisma";
import type { InquiryFormData } from "@/lib/validations/inquiry.schema";

export async function createInquiry(data: InquiryFormData) {
  return prisma.inquiry.create({
    data: {
      name: data.fullName,
      phone: data.phone,
      message: data.message,
      propertyId: data.propertyId || null,
      isRead: false,
    },
  });
}

export async function getInquiries(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.inquiry.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    }),
    prisma.inquiry.count(),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
