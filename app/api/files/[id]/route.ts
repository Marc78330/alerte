import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { resolveVaultPath } from "@/lib/storage";
import { normalizeTrackingToken } from "@/lib/tokens";

const MIME_ALIASES: Record<string, string> = {
  "image/jpg": "image/jpeg",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const attachment = await prisma.attachment.findUnique({
    where: { id },
    include: { report: { select: { id: true, trackingToken: true, clubId: true } } },
  });
  if (!attachment) {
    return new NextResponse("Pièce jointe introuvable.", { status: 404 });
  }

  const authorization = await getAuthorization(request, attachment.report.clubId, attachment.report.trackingToken);
  if (!authorization) {
    return new NextResponse("Accès refusé : autorisation manquante ou invalide.", { status: 403 });
  }

  try {
    const data = await readFile(resolveVaultPath(attachment.filePath));
    const mime = MIME_ALIASES[attachment.mimeType] ?? attachment.mimeType;
    const utfName = encodeURIComponent(attachment.originalName).replace(/'/g, "%27");
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `inline; filename*=UTF-8''${utfName}`,
        "Content-Length": String(data.length),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse("Fichier manquant sur le serveur.", { status: 404 });
  }
}

async function getAuthorization(
  request: NextRequest,
  clubId: string,
  reportToken: string,
): Promise<boolean> {
  const url = new URL(request.url);
  const tokenParam = url.searchParams.get("token");
  if (tokenParam) {
    return normalizeTrackingToken(tokenParam) === reportToken;
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  const session = sessionToken ? await verifySessionToken(sessionToken) : null;
  if (!session) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { clubId: true },
  });
  return user?.clubId === clubId;
}