"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

export function LangToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const other: Locale = locale === "ar" ? "en" : "ar";
  const qs = sp.toString();
  const href = pathname.replace(/^\/(ar|en)/, `/${other}`) + (qs ? `?${qs}` : "");

  return (
    <Link
      href={href}
      hrefLang={other}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${other};path=/;max-age=31536000;samesite=lax`;
      }}
      className={cn(
        "glass-btn inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium transition active:scale-95"
      )}
    >
      <Languages className="h-4 w-4" />
      {other === "ar" ? "العربية" : "English"}
    </Link>
  );
}
