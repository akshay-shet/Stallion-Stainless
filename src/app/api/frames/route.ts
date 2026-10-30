import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const candidates = [
      path.join(process.cwd(), "public", "frames"),
      "D:\\Stallion Project\\Items\\Home page Video_frames",
      "D:/Stallion Project/Items/Home page Video_frames",
    ];

    let foundDir: string | null = null;
    let files: string[] = [];

    for (const dir of candidates) {
      if (fs.existsSync(dir)) {
        const list = fs
          .readdirSync(dir)
          .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));
        if (list.length > 0) {
          foundDir = dir;
          files = list;
          break;
        }
      }
    }

    if (!foundDir || files.length === 0) {
      return NextResponse.json({ frames: [], total: 0 });
    }

    // Natural sort: 1, 2, 3 ... 10, 11
    files.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );

    const isPublic = foundDir.includes("public");
    const frameUrls = files.map((f) =>
      isPublic ? `/frames/${f}` : `/api/frames/image?file=${encodeURIComponent(f)}`
    );

    return NextResponse.json(
      {
        frames: frameUrls,
        total: frameUrls.length,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message, frames: [] }, { status: 500 });
  }
}
