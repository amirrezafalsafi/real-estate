import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";
import { getProperties, createProperty } from "@/server/services/property.service";
import { propertyFilterQuerySchema } from "@/lib/validations/property-filter.zod";
import { propertySchema } from "@/lib/validations/property.schema";
import { getCurrentUser } from "@/lib/user-auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawParams = Object.fromEntries(searchParams.entries());

    const validation = propertyFilterQuerySchema.safeParse(rawParams);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "پارامترهای جستجو نامعتبر هستند",
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      page,
      limit,
      sort,
      query,
      search,
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
    } = validation.data;

    const data = await getProperties(
      {
        query,
        search,
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
      },
      { page, limit },
      sort
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "خطا در دریافت لیست املاک",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = await propertySchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const user = await getCurrentUser();
    const property = await createProperty(validatedData, user?.id || null);

    return NextResponse.json(
      {
        success: true,
        message: "ملک با موفقیت ثبت شد",
        data: property,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      const validationErrors = error.inner.map((item) => item.message);
      return NextResponse.json(
        {
          success: false,
          error: validationErrors.join("، "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "خطا در پردازش درخواست",
      },
      { status: 500 }
    );
  }
}
