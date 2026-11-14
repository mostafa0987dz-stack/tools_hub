import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import { LangToggle } from "@/components/layout/LangToggle";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { adminDb, dbConfigured, isAdmin } from "@/lib/admin-auth";
import { categories } from "@/lib/categories";
import { getDict, isLocale } from "@/lib/i18n/config";
import type { Tool } from "@/lib/types";
import { addTool, deleteTool, login, logout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; added?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const t = getDict(locale);
  const a = t.admin;
  const authed = await isAdmin();

  const errors: Record<string, string> = {
    password: a.errPassword, slug: a.errSlug, url: a.errUrl, db: a.errDb,
  };
  const errorMsg = sp.error ? errors[sp.error] : null;

  let saved: Tool[] = [];
  if (authed && dbConfigured()) {
    const { data } = await adminDb().from("tools").select("*").order("created_at", { ascending: false });
    saved = (data as Tool[]) ?? [];
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

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 md:p-10">
      <div className="glass flex items-center justify-between px-5 py-3">
        <h1 className="text-lg font-bold">{a.title}</h1>
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
      {sp.added && <p className="glass p-4 text-teal-600 dark:text-teal-300">{a.added}</p>}
      {errorMsg && <p className="glass p-4 text-red-500">{errorMsg}</p>}

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

      {saved.length > 0 && (
        <section className="glass p-5 md:p-8">
          <h2 className="mb-4 text-xl font-bold">{a.existing}</h2>
          <ul className="divide-y divide-white/40 dark:divide-white/10">
            {saved.map((s) => (
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
    </main>
  );
}
