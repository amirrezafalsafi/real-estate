import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
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
        { success: false, error: "هیچ تصویری برای بارگذاری انتخاب نشده است." },
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

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "حجم هر تصویر نمی‌تواند بیش از ۵ مگابایت باشد." },
          { status: 400 }
        );
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
        { success: false, error: "فایل‌های ارسالی معتبر نیستند." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "خطا در آپلود تصاویر رخ داد." },
      { status: 500 }
    );
  }
}
