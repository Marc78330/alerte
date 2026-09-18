"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export type AuthActionResult = { error?: string };

export async function loginAction(
  _prevState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Identifiants invalides." };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { club: true },
  });

  if (!user) {
    return { error: "Email ou mot de passe incorrect." };
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return { error: "Email ou mot de passe incorrect." };
  }

  const token = await createSessionToken({ userId: user.id, email: user.email });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions());

  redirect(user.role === "SUPER_ADMIN" ? "/admin/plateforme" : "/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}