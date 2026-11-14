import { notFound } from "next/navigation";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { getActiveAds, pickMany } from "@/lib/ads";
import { getDict, isLocale } from "@/lib/i18n/config";
import { getTools } from "@/lib/tools";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [tools, ads] = await Promise.all([getTools(), getActiveAds()]);
  return <ToolGrid tools={tools} ads={pickMany(ads, locale, "grid")} locale={locale} t={getDict(locale)} />;
}
