import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { resolveLogoPath } from "@/lib/storage";

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const club = await prisma.club.findUnique({
    where: { slug },
    select: { logoFileName: true },
  });
  if (!club?.logoFileName) {
    return new NextResponse("Logo non configuré.", { status: 404 });
  }

  try {
    const data = await readFile(resolveLogoPath(club.logoFileName));
    const ext = path.extname(club.logoFileName).toLowerCase();
    const mime = MIME_BY_EXT[ext] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Content-Length": String(data.length),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("Fichier manquant sur le serveur.", { status: 404 });
  }
}