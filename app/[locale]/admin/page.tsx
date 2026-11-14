import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LogOut, Pause, Play, Trash2 } from "lucide-react";
import { AdFormFields } from "@/components/admin/AdFormFields";
import { LangToggle } from "@/components/layout/LangToggle";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { adminDb, dbConfigured, isAdmin } from "@/lib/admin-auth";
import { categories } from "@/lib/categories";
import { getDict, isLocale } from "@/lib/i18n/config";
import type { Ad, Tool } from "@/lib/types";
import { cn } from "@/lib/utils";
import { addAd, addTool, deleteAd, deleteTool, login, logout, toggleAd } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; added?: string; tab?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const t = getDict(locale);
  const a = t.admin;
  const authed = await isAdmin();
  const tab = sp.tab === "ads" ? "ads" : "tools";

  const errors: Record<string, string> = {
    password: a.errPassword, slug: a.errSlug, url: a.errUrl, db: a.errDb, ad: a.errAd,
  };
  const errorMsg = sp.error ? errors[sp.error] : null;

  let savedTools: Tool[] = [];
  let savedAds: Ad[] = [];
  if (authed && dbConfigured()) {
    const db = adminDb();
    if (tab === "tools") {
      const { data } = await db.from("tools").select("*").order("created_at", { ascending: false });
      savedTools = (data as Tool[]) ?? [];
    } else {
      const { data } = await db.from("ads").select("*").order("created_at", { ascending: false });
      savedAds = (data as Ad[]) ?? [];
    }
  }

  const bar = (
    <div className="flex items-center gap-2">
      <Suspense><LangToggle locale={locale} /></Suspense>
      <ThemeToggle label={t.toggleTheme} />
    </div>
  );

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center p-4">
        <form action={login} className="glass w-full max-w-sm space-y-4 p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{a.title}</h1>
            {bar}
          </div>
          <input type="hidden" name="locale" value={locale} />
          <input name="password" type="password" placeholder={a.password} className="glass-input" required autoFocus />
          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
          <Button className="w-full">{a.login}</Button>
        </form>
      </main>
    );
  }

  const tabLink = (id: "tools" | "ads", label: string) => (
    <Link
      href={`/${locale}/admin${id === "ads" ? "?tab=ads" : ""}`}
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-medium transition",
        tab === id ? "bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow" : "hover:bg-white/60 dark:hover:bg-white/10"
      )}
    >
      {label}
    </Link>
  );

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 md:p-10">
      <div className="glass flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-2">
          <h1 className="me-2 text-lg font-bold">{a.title}</h1>
          {tabLink("tools", a.tabTools)}
          {tabLink("ads", a.tabAds)}
        </div>
        <div className="flex items-center gap-2">
          {bar}
          <form action={logout}>
            <input type="hidden" name="locale" value={locale} />
            <Button variant="glass" size="icon" aria-label={a.logout} title={a.logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {!dbConfigured() && <p className="glass p-4 text-amber-600 dark:text-amber-400">{a.noDb}</p>}
      {sp.added && <p className="glass p-4 text-teal-600 dark:text-teal-300">{tab === "ads" ? a.adAdded : a.added}</p>}
      {errorMsg && <p className="glass p-4 text-red-500">{errorMsg}</p>}

      {tab === "tools" ? (
        <>
          <form action={addTool} className="glass grid gap-4 p-5 md:p-8">
            <h2 className="text-2xl font-bold">{a.add}</h2>
            <input type="hidden" name="locale" value={locale} />
            <input name="slug" placeholder={a.slug} className="glass-input" dir="ltr" required />
            <div className="grid gap-4 md:grid-cols-2">
              <input name="name_ar" placeholder={a.nameAr} className="glass-input" required />
              <input name="name_en" placeholder={a.nameEn} className="glass-input" dir="ltr" required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <textarea name="description_ar" placeholder={a.descAr} className="glass-input" rows={3} />
              <textarea name="description_en" placeholder={a.descEn} className="glass-input" dir="ltr" rows={3} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <select name="category" className="glass-input" aria-label={a.category} required>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{t.categories[c.id]}</option>
                ))}
              </select>
              <select name="kind" className="glass-input" aria-label={a.kind} defaultValue="link" required>
                <option value="link">{a.kindLink}</option>
                <option value="iframe">{a.kindIframe}</option>
                <option value="internal">{a.kindInternal}</option>
              </select>
              <input name="icon" placeholder={`${a.icon} - ${a.iconHint}`} className="glass-input" dir="ltr" />
            </div>
            <input name="url" type="url" placeholder={a.url} className="glass-input" dir="ltr" />
            <Button>{a.save}</Button>
          </form>

          {savedTools.length > 0 && (
            <section className="glass p-5 md:p-8">
              <h2 className="mb-4 text-xl font-bold">{a.existing}</h2>
              <ul className="divide-y divide-white/40 dark:divide-white/10">
                {savedTools.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{locale === "ar" ? s.name_ar : s.name_en}</p>
                      <p className="truncate text-xs text-slate-500" dir="ltr">/{s.slug} · {s.category} · {s.kind}</p>
                    </div>
                    <form action={deleteTool}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <Button variant="glass" size="sm" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                        {a.delete}
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <>
          <form action={addAd} className="glass grid gap-4 p-5 md:p-8">
            <h2 className="text-2xl font-bold">{a.addAd}</h2>
            <input type="hidden" name="locale" value={locale} />
            <AdFormFields a={a} />
            <Button>{a.save}</Button>
          </form>

          <section className="glass p-5 md:p-8">
            <h2 className="mb-4 text-xl font-bold">{a.existingAds}</h2>
            {savedAds.length === 0 ? (
              <p className="text-slate-500">{a.noAds}</p>
            ) : (
              <ul className="divide-y divide-white/40 dark:divide-white/10">
                {savedAds.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate font-medium">
                        <span className={cn("h-2 w-2 shrink-0 rounded-full", s.is_active ? "bg-teal-500" : "bg-slate-400")} />
                        {s.name}
                        <span className="text-xs font-normal text-slate-500">{s.is_active ? a.active : a.inactive}</span>
                      </p>
                      <p className="truncate text-xs text-slate-500" dir="ltr">
                        {s.type} · {s.placement} · {s.locale} · P{s.priority}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <form action={toggleAd}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="locale" value={locale} />
                        <input type="hidden" name="next" value={String(!s.is_active)} />
                        <Button variant="glass" size="sm">
                          {s.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          {s.is_active ? a.deactivate : a.activate}
                        </Button>
                      </form>
                      <form action={deleteAd}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="locale" value={locale} />
                        <Button variant="glass" size="sm" className="text-red-500" aria-label={a.delete} title={a.delete}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
