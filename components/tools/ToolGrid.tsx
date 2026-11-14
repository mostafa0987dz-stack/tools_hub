"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import type { Dict, Locale } from "@/lib/i18n/config";
import type { Tool } from "@/lib/types";
import { ToolCard } from "./ToolCard";

export function ToolGrid({ tools, locale, t }: { tools: Tool[]; locale: Locale; t: Dict }) {
  const sp = useSearchParams();
  const cat = sp.get("cat");
  const [q, setQ] = useState(sp.get("q") ?? "");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return tools.filter((x) => {
      if (cat && x.category !== cat) return false;
      if (!s) return true;
      return `${x.name_ar} ${x.name_en} ${x.description_ar ?? ""} ${x.description_en ?? ""}`.toLowerCase().includes(s);
    });
  }, [tools, cat, q]);

  const title = cat && cat in t.categories ? t.categories[cat as keyof typeof t.categories] : t.all;

  return (
    <section className="space-y-5">
      <div className="glass flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="glass-input ps-10"
          />
        </div>
      </div>

      {list.length === 0 ? (
        <p className="glass p-8 text-center text-slate-500">{t.noTools}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} locale={locale} t={t} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
