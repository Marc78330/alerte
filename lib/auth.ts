import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { club: true },
  });
  return user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireSuperAdmin() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "SUPER_ADMIN") redirect("/admin/dashboard");
  return user;
}