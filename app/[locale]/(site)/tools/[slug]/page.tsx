import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { InternalTool } from "@/components/tools/internal";
import { getDict, isLocale } from "@/lib/i18n/config";
import { toolLd } from "@/lib/jsonld";
import { getTool } from "@/lib/tools";
import { localized } from "@/lib/utils";

export const revalidate = 60;

type P = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const tool = await getTool(slug);
  if (!tool) return {};
  return {
    title: localized(tool, locale, "name"),
    description: localized(tool, locale, "description"),
    alternates: { canonical: `/${locale}/tools/${slug}`, languages: { ar: `/ar/tools/${slug}`, en: `/en/tools/${slug}` } },
  };
}

export default async function ToolPage({ params }: P) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const tool = await getTool(slug);
  if (!tool) notFound();

  const t = getDict(locale);
  const name = localized(tool, locale, "name");
  const desc = localized(tool, locale, "description");
  const safeUrl = tool.url && /^https:\/\//i.test(tool.url) ? tool.url : null;

  return (
    <article className="glass p-5 md:p-8">
      <JsonLd data={toolLd(tool, locale, name, desc, t.appName)} />

      <Link href={`/${locale}`} className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 dark:text-slate-400">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {t.back}
      </Link>

      <header className="mb-6 flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-purple-500 text-white shadow-lg">
          <Icon name={tool.icon} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{name}</h1>
          {desc && <p className="mt-1 max-w-prose text-slate-600 dark:text-slate-300">{desc}</p>}
        </div>
      </header>

      {tool.kind === "internal" && <InternalTool slug={tool.slug} t={t} />}

      {tool.kind === "iframe" && safeUrl && (
        <iframe
          src={safeUrl}
          title={name}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
          className="h-[75vh] w-full rounded-xl border-0 bg-white"
        />
      )}

      {tool.kind === "link" && safeUrl && (
        <Button asChild>
          <a href={safeUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            {t.openExternal}
          </a>
        </Button>
      )}
    </article>
  );
}
