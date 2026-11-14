import type { Tool } from "./types";
import type { Locale } from "./i18n/config";

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function websiteLd(locale: Locale, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url: `${siteUrl()}/${locale}`,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl()}/${locale}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function toolLd(tool: Tool, locale: Locale, name: string, description: string, home: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name,
      description,
      url: `${siteUrl()}/${locale}/tools/${tool.slug}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      inLanguage: locale,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: home, item: `${siteUrl()}/${locale}` },
        { "@type": "ListItem", position: 2, name, item: `${siteUrl()}/${locale}/tools/${tool.slug}` },
      ],
    },
  ];
}
