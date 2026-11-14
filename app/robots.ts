import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/jsonld";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/ar/admin", "/en/admin"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
