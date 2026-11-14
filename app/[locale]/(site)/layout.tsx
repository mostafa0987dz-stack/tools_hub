import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { getActiveAds, pickOne } from "@/lib/ads";
import { getDict, isLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ads = await getActiveAds();
  return (
    <Suspense>
      <Shell
        locale={locale}
        t={getDict(locale)}
        topAd={pickOne(ads, locale, "top")}
        sidebarAd={pickOne(ads, locale, "sidebar")}
      >
        {children}
      </Shell>
    </Suspense>
  );
}
