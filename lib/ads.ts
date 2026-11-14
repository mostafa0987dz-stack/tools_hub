import { createClient } from "@supabase/supabase-js";
import type { Ad, AdPlacement } from "./types";
import type { Locale } from "./i18n/config";

/** Active ads, highest priority first. Returns [] if Supabase / table is missing. */
export async function getActiveAds(): Promise<Ad[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return [];
  try {
    const sb = createClient(url, anon, { auth: { persistSession: false } });
    const { data, error } = await sb
      .from("ads")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: false });
    return error || !data ? [] : (data as Ad[]);
  } catch {
    return [];
  }
}

const forSlot = (ads: Ad[], locale: Locale, placement: AdPlacement) =>
  ads.filter((a) => a.placement === placement && (a.locale === "all" || a.locale === locale));

/** One ad for a single-slot placement: highest priority, random among ties. */
export function pickOne(ads: Ad[], locale: Locale, placement: AdPlacement): Ad | null {
  const list = forSlot(ads, locale, placement);
  if (!list.length) return null;
  const tied = list.filter((a) => a.priority === list[0].priority);
  return tied[Math.floor(Math.random() * tied.length)];
}

export const pickMany = (ads: Ad[], locale: Locale, placement: AdPlacement) => forSlot(ads, locale, placement);
