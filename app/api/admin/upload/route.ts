import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "احراز هویت انجام نشده است." },
        { status: 401 }
      );
    }
    const session = await verifyAdminToken(token);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "نشست نامعتبر است." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const filesToUpload: File[] = [];
    if (files && files.length > 0) {
      filesToUpload.push(...files);
    } else if (singleFile) {
      filesToUpload.push(singleFile);
    }

    if (filesToUpload.length === 0) {
      return NextResponse.json(
        { success: false, error: "هیچ فایلی برای بارگذاری ارسال نشده است." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      if (!file || typeof file.arrayBuffer !== "function") continue;

      if (!file.type.startsWith("image/")) {
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".jpg";
      const randomStr = crypto.randomBytes(6).toString("hex");
      const filename = `${Date.now()}-${randomStr}${ext}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/${filename}`);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: "فایل ارسالی باید تصویر معتبر (JPG, PNG, WebP) باشد." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0],
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در آپلود تصویر روی سرور." },
      { status: 500 }
    );
  }
}
