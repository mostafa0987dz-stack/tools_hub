"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import type { Dict, Locale } from "@/lib/i18n/config";
import type { Ad, Tool } from "@/lib/types";
import { ToolCard } from "./ToolCard";

const AD_EVERY = 6; // one ad after every 6 tools

type Item = { kind: "tool"; tool: Tool } | { kind: "ad"; ad: Ad; key: string };

export function ToolGrid({ tools, ads = [], locale, t }: { tools: Tool[]; ads?: Ad[]; locale: Locale; t: Dict }) {
  const sp = useSearchParams();
  const cat = sp.get("cat");
  const [q, setQ] = useState(sp.get("q") ?? "");

  const items = useMemo<Item[]>(() => {
    const s = q.trim().toLowerCase();
    const list = tools.filter((x) => {
      if (cat && x.category !== cat) return false;
      if (!s) return true;
      return `${x.name_ar} ${x.name_en} ${x.description_ar ?? ""} ${x.description_en ?? ""}`.toLowerCase().includes(s);
    });
    const out: Item[] = [];
    let a = 0;
    list.forEach((tool, i) => {
      out.push({ kind: "tool", tool });
      if (ads.length && (i + 1) % AD_EVERY === 0) {
        out.push({ kind: "ad", ad: ads[a % ads.length], key: `ad-${i}` });
        a++;
      }
    });
    return out;
  }, [tools, ads, cat, q]);

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

      {items.length === 0 ? (
        <p className="glass p-8 text-center text-slate-500">{t.noTools}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((it, i) =>
              it.kind === "tool" ? (
                <ToolCard key={it.tool.slug} tool={it.tool} locale={locale} t={t} index={i} />
              ) : (
                <motion.div key={it.key} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AdSlot ad={it.ad} label={t.ad} className="h-full" />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
