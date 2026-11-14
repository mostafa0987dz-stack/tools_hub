"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminDb, isAdmin, passwordMatches, setAdminCookie } from "@/lib/admin-auth";

const CATEGORIES = ["text", "image", "pdf", "dev", "other"];
const KINDS = ["internal", "link", "iframe"];
const loc = (fd: FormData) => (fd.get("locale") === "en" ? "en" : "ar");
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function login(fd: FormData) {
  const l = loc(fd);
  if (!passwordMatches(str(fd, "password"))) redirect(`/${l}/admin?error=password`);
  await setAdminCookie();
  redirect(`/${l}/admin`);
}

export async function logout(fd: FormData) {
  (await cookies()).delete("admin_session");
  redirect(`/${loc(fd)}/admin`);
}

export async function addTool(fd: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const l = loc(fd);

  const slug = str(fd, "slug").toLowerCase().replace(/\s+/g, "-");
  const kind = str(fd, "kind");
  const category = str(fd, "category");
  const url = str(fd, "url");

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) redirect(`/${l}/admin?error=slug`);
  if (!KINDS.includes(kind) || !CATEGORIES.includes(category)) redirect(`/${l}/admin?error=db`);
  if (kind !== "internal" && !/^https:\/\//i.test(url)) redirect(`/${l}/admin?error=url`);

  const { error } = await adminDb().from("tools").insert({
    slug,
    name_ar: str(fd, "name_ar"),
    name_en: str(fd, "name_en"),
    description_ar: str(fd, "description_ar") || null,
    description_en: str(fd, "description_en") || null,
    category,
    icon: str(fd, "icon") || "Wrench",
    kind,
    url: kind === "internal" ? null : url,
  });
  if (error) redirect(`/${l}/admin?error=db`);

  revalidatePath("/[locale]", "layout");
  redirect(`/${l}/admin?added=1`);
}

export async function deleteTool(fd: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  await adminDb().from("tools").delete().eq("id", str(fd, "id"));
  revalidatePath("/[locale]", "layout");
  redirect(`/${loc(fd)}/admin`);
}

// ---------------- Ads ----------------
const AD_TYPES = ["banner", "adsense", "code"];
const PLACEMENTS = ["top", "sidebar", "grid", "tool_bottom"];
const AD_LOCALES = ["all", "ar", "en"];
const https = (u: string) => /^https:\/\//i.test(u);

export async function addAd(fd: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const l = loc(fd);
  const bad = () => redirect(`/${l}/admin?tab=ads&error=ad`);

  const type = str(fd, "type");
  const placement = str(fd, "placement");
  const adLocale = str(fd, "ad_locale");
  const name = str(fd, "name");
  if (!name || !AD_TYPES.includes(type) || !PLACEMENTS.includes(placement) || !AD_LOCALES.includes(adLocale)) bad();

  const row: Record<string, unknown> = {
    name, type, placement, locale: adLocale,
    priority: parseInt(str(fd, "priority"), 10) || 0,
    is_active: true,
  };

  if (type === "banner") {
    const image = str(fd, "image_url"), link = str(fd, "link_url");
    if (!https(image) || !https(link)) bad();
    Object.assign(row, { image_url: image, link_url: link });
  } else if (type === "adsense") {
    const client = str(fd, "adsense_client"), slot = str(fd, "adsense_slot");
    if (!/^ca-pub-\d+$/.test(client) || !/^\d+$/.test(slot)) bad();
    Object.assign(row, { adsense_client: client, adsense_slot: slot });
  } else {
    const code = String(fd.get("code") ?? "").trim();
    if (!code) bad();
    const h = Math.min(600, Math.max(50, parseInt(str(fd, "height"), 10) || 250));
    Object.assign(row, { code, height: h });
  }

  const { error } = await adminDb().from("ads").insert(row);
  if (error) redirect(`/${l}/admin?tab=ads&error=db`);
  revalidatePath("/[locale]", "layout");
  redirect(`/${l}/admin?tab=ads&added=1`);
}

export async function toggleAd(fd: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  await adminDb().from("ads").update({ is_active: str(fd, "next") === "true" }).eq("id", str(fd, "id"));
  revalidatePath("/[locale]", "layout");
  redirect(`/${loc(fd)}/admin?tab=ads`);
}

export async function deleteAd(fd: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  await adminDb().from("ads").delete().eq("id", str(fd, "id"));
  revalidatePath("/[locale]", "layout");
  redirect(`/${loc(fd)}/admin?tab=ads`);
}
