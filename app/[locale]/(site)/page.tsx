import { notFound } from "next/navigation";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { getDict, isLocale } from "@/lib/i18n/config";
import { getTools } from "@/lib/tools";

export const revalidate = 60;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const tools = await getTools();
  return <ToolGrid tools={tools} locale={locale} t={getDict(locale)} />;
}
