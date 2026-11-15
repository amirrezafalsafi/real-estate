import { NextRequest, NextResponse } from "next/server";
import { inquiryInputSchema } from "@/lib/validations/inquiry.zod";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    const result = inquiryInputSchema.safeParse(json);

    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      return NextResponse.json(
        {
          success: false,
          error: errorMessages.join("، "),
          issues: result.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, phone, message, propertyId } = result.data;

    if (propertyId) {
      const propertyExists = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true },
      });

      if (!propertyExists) {
        return NextResponse.json(
          {
            success: false,
            error: "ملک مورد نظر یافت نشد",
          },
          { status: 404 }
        );
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        phone,
        message,
        propertyId: propertyId || null,
        isRead: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "درخواست مشاوره شما با موفقیت ثبت شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.",
        data: inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "خطا در پردازش درخواست مشاوره",
      },
      { status: 500 }
    );
  }
}
