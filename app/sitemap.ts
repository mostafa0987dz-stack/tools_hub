import type { MetadataRoute } from "next";
import { getTools } from "@/lib/tools";
import { locales } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await getTools();
  const base = siteUrl();
  return locales.flatMap((l) => [
    { url: `${base}/${l}`, changeFrequency: "weekly" as const, priority: 1 },
    ...tools.map((t) => ({
      url: `${base}/${l}/tools/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]);
}
