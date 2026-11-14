import { createClient } from "@supabase/supabase-js";
import { builtinTools } from "./builtin-tools";
import type { Tool } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getTools(): Promise<Tool[]> {
  if (!url || !anon) return builtinTools;
  try {
    const sb = createClient(url, anon, { auth: { persistSession: false } });
    const { data, error } = await sb
      .from("tools")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error || !data) return builtinTools;
    const taken = new Set(data.map((t) => t.slug));
    return [...(data as Tool[]), ...builtinTools.filter((b) => !taken.has(b.slug))];
  } catch {
    return builtinTools;
  }
}

export async function getTool(slug: string): Promise<Tool | null> {
  return (await getTools()).find((t) => t.slug === slug) ?? null;
}
