import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { getDict, isLocale } from "@/lib/i18n/config";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <Suspense>
      <Shell locale={locale} t={getDict(locale)}>
        {children}
      </Shell>
    </Suspense>
  );
}
