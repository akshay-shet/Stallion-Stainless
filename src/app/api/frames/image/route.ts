import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");

  if (!file) {
    return new NextResponse("File param missing", { status: 400 });
  }

  // Prevent directory traversal
  const cleanName = path.basename(file);
  const filePath = path.join("D:\\Stallion Project\\Items\\Home page Video_frames", cleanName);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(cleanName).toLowerCase();
  let contentType = "image/jpeg";
  if (ext === ".png") contentType = "image/png";
  if (ext === ".webp") contentType = "image/webp";

  const buffer = fs.readFileSync(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
