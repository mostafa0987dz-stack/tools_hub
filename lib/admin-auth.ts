import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

const token = () =>
  createHash("sha256")
    .update(`${process.env.ADMIN_PASSWORD}:${process.env.ADMIN_SESSION_SECRET}`)
    .digest("hex");

export function passwordMatches(input: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(process.env.ADMIN_PASSWORD ?? "").digest();
  return !!process.env.ADMIN_PASSWORD && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const v = (await cookies()).get("admin_session")?.value;
  return !!v && !!process.env.ADMIN_PASSWORD && v === token();
}

export async function setAdminCookie() {
  (await cookies()).set("admin_session", token(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export const dbConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export const adminDb = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
