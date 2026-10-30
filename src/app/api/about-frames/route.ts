import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const candidates = [
      path.join(process.cwd(), "public", "about-frames"),
    ];

    let foundDir: string | null = null;
    let files: string[] = [];

    for (const dir of candidates) {
      if (fs.existsSync(/*turbopackIgnore: true*/ dir)) {
        const list = fs
          .readdirSync(/*turbopackIgnore: true*/ dir)
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

    // Natural sort: frame_000001 ... frame_000183
    files.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );

    const isPublic = foundDir.includes("public");
    const frameUrls = files.map((f) =>
      isPublic ? `/about-frames/${f}` : `/api/about-frames/image?file=${encodeURIComponent(f)}`
    );

    return NextResponse.json(
      {
        frames: frameUrls,
        total: frameUrls.length,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message, frames: [] }, { status: 500 });
  }
}
