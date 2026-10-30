import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const viewParam = req.nextUrl.searchParams.get("view");
  const ua = req.headers.get("user-agent") || "";
  const isAndroidClient =
    viewParam === "android" ||
    req.nextUrl.searchParams.get("type") === "android" ||
    (viewParam !== "desktop" && /Android|iPhone|iPad|iPod|Mobile/i.test(ua));

  const androidVideoPath = path.join(process.cwd(), "public", "hero-android.mp4");
  const desktopVideoPath = path.join(process.cwd(), "public", "hero-desktop.mp4");

  let videoPath = isAndroidClient && fs.existsSync(/*turbopackIgnore: true*/ androidVideoPath)
    ? androidVideoPath
    : desktopVideoPath;

  if (!fs.existsSync(/*turbopackIgnore: true*/ videoPath)) {
    if (fs.existsSync(/*turbopackIgnore: true*/ desktopVideoPath)) {
      videoPath = desktopVideoPath;
    } else if (fs.existsSync(/*turbopackIgnore: true*/ androidVideoPath)) {
      videoPath = androidVideoPath;
    } else {
      return new NextResponse("Video not found", { status: 404 });
    }
  }

  const stat = fs.statSync(/*turbopackIgnore: true*/ videoPath);
  const fileSize = stat.size;
  const range = req.headers.get("range");

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const fileStream = fs.createReadStream(/*turbopackIgnore: true*/ videoPath, { start, end });

    // Stream range chunks for smooth 60fps browser buffering
    return new NextResponse(fileStream as any, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": "video/mp4",
      },
    });
  } else {
    const fileStream = fs.createReadStream(/*turbopackIgnore: true*/ videoPath);
    return new NextResponse(fileStream as any, {
      status: 200,
      headers: {
        "Content-Length": fileSize.toString(),
        "Content-Type": "video/mp4",
      },
    });
  }
}

