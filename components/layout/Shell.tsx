"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Wrench, X } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/categories";
import { isRtl, type Dict, type Locale } from "@/lib/i18n/config";
import type { Ad } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LangToggle } from "./LangToggle";
import { ThemeToggle } from "./ThemeToggle";

function SidebarNav({ locale, t, onNavigate }: { locale: Locale; t: Dict; onNavigate?: () => void }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const onHome = pathname === `/${locale}`;
  const active = onHome ? sp.get("cat") ?? "all" : null;
  const items = [{ id: "all", icon: "LayoutGrid", label: t.all }, ...categories.map((c) => ({ id: c.id, icon: c.icon, label: t.categories[c.id] }))];

  return (
    <nav aria-label={t.categoriesTitle} className="flex flex-col gap-1">
      <p className="mb-1 px-3 text-xs font-medium text-slate-500 dark:text-slate-400">{t.categoriesTitle}</p>
      {items.map((i) => (
        <Link
          key={i.id}
          href={i.id === "all" ? `/${locale}` : `/${locale}?cat=${i.id}`}
          onClick={onNavigate}
          aria-current={active === i.id ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
            active === i.id
              ? "bg-gradient-to-r from-teal-500/20 to-purple-500/20 font-medium text-teal-700 dark:text-teal-200"
              : "hover:bg-white/60 dark:hover:bg-white/10"
          )}
        >
          <Icon name={i.icon} className="h-4 w-4" />
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

function Brand({ locale, name }: { locale: Locale; name: string }) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-2 font-bold">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-400 to-purple-500 text-white shadow">
        <Wrench className="h-5 w-5" />
      </span>
      <span className="text-lg">{name}</span>
    </Link>
  );
}

export function Shell({
  locale, t, children, topAd = null, sidebarAd = null,
}: { locale: Locale; t: Dict; children: React.ReactNode; topAd?: Ad | null; sidebarAd?: Ad | null }) {
  const [open, setOpen] = useState(false);
  const rtl = isRtl(locale);

  return (
    <div className="mx-auto flex max-w-[1600px] gap-4 p-3 md:p-4">
      {/* Desktop sidebar */}
      <aside className="glass sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col gap-6 overflow-y-auto p-4 lg:flex">
        <Brand locale={locale} name={t.appName} />
        <SidebarNav locale={locale} t={t} />
        <div className="mt-auto"><AdSlot ad={sidebarAd} label={t.ad} /></div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button aria-label="close" className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.aside
              className="glass absolute inset-y-3 start-3 flex w-72 max-w-[85vw] flex-col gap-6 p-4"
              initial={{ x: rtl ? "110%" : "-110%" }}
              animate={{ x: 0 }}
              exit={{ x: rtl ? "110%" : "-110%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <div className="flex items-center justify-between">
                <Brand locale={locale} name={t.appName} />
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="close">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SidebarNav locale={locale} t={t} onNavigate={() => setOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <header className="glass sticky top-3 z-30 flex items-center gap-2 px-3 py-2.5 md:px-4">
          <Button variant="glass" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label={t.menu}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="lg:hidden"><Brand locale={locale} name={t.appName} /></div>
          <p className="hidden text-sm text-slate-600 dark:text-slate-300 lg:block">{t.tagline}</p>
          <div className="ms-auto flex items-center gap-2">
            <LangToggle locale={locale} />
            <ThemeToggle label={t.toggleTheme} />
          </div>
        </header>
        <main className="min-w-0 space-y-4">
          <AdSlot ad={topAd} label={t.ad} />
          {children}
        </main>
      </div>
    </div>
  );
}
