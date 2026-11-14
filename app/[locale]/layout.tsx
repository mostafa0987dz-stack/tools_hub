import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { Tajawal } from "next/font/google";
import "../globals.css";
import { getDict, isLocale, isRtl, locales, type Locale } from "@/lib/i18n/config";
import { siteUrl, websiteLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { PWARegister } from "@/components/PWARegister";

const font = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e0f2f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1f24" },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${t.appName} | ${t.tagline}`, template: `%s | ${t.appName}` },
    description: t.tagline,
    alternates: { canonical: `/${locale}`, languages: { ar: "/ar", en: "/en" } },
    openGraph: { title: t.appName, description: t.tagline, locale, type: "website" },
    icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
    appleWebApp: { capable: true, title: t.appName, statusBarStyle: "default" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale as Locale);

  return (
    <html lang={locale} dir={isRtl(locale as Locale) ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${font.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
          {/* soft color blobs so the glass has something to blur */}
          <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-32 start-[-8rem] h-96 w-96 rounded-full bg-teal-400/30 blur-3xl dark:bg-teal-500/20" />
            <div className="absolute bottom-[-8rem] end-[-6rem] h-[28rem] w-[28rem] rounded-full bg-purple-400/30 blur-3xl dark:bg-purple-500/20" />
          </div>
          <JsonLd data={websiteLd(locale as Locale, t.appName, t.tagline)} />
          {children}
          <PWARegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
