import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];
const APP_HOST = process.env.APP_URL
  ? new URL(process.env.APP_URL).hostname
  : "";

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const requestHost = (request.headers.get("host") ?? hostname).split(":")[0];

  // Routage par domaine custom de club : n'importe quel hôte mappé à un club
  // voit sa racine / renvoyée vers le formulaire du club. Les chemins globaux
  // (/suivi, /admin...) restent disponibles sur le domaine custom.
  if (requestHost !== APP_HOST) {
    const club = await prisma.club.findFirst({
      where: { customDomain: requestHost },
      select: { slug: true, isActive: true },
    });
    if (club) {
      if (club.isActive && pathname === "/") {
        return NextResponse.rewrite(
          new URL(`/club/${club.slug}/signalement`, request.url),
        );
      }
      if (!club.isActive) {
        return NextResponse.rewrite(
          new URL(`/club/${club.slug}/desactive`, request.url),
        );
      }
    }
  }

  const isAdminArea = pathname.startsWith("/admin");
  if (!isAdminArea) return NextResponse.next();

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(sessionCookie);
  const isLoginPage = PUBLIC_ADMIN_PATHS.includes(pathname);

  if (session && isLoginPage) {
    const user = session.userId
      ? await prisma.user.findUnique({
          where: { id: session.userId },
          select: { role: true },
        })
      : null;
    return NextResponse.redirect(
      new URL(
        user?.role === "SUPER_ADMIN" ? "/admin/plateforme" : "/admin/dashboard",
        request.url,
      ),
    );
  }

  if (!session && !isLoginPage) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};