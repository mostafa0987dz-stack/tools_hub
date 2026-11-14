# ToolsHub — أدوات هب

Next.js 15 (App Router) + Tailwind + Shadcn-style UI + Framer Motion + Supabase.
Glassmorphism, Dark/Light, Arabic (RTL) / English, PWA, JSON-LD.

## التشغيل

```bash
npm install
cp .env.example .env.local     # ثم عبّئ القيم
npm run dev                    # http://localhost:3000
```

## إعداد Supabase

1. أنشئ مشروعاً على supabase.com.
2. افتح **SQL Editor** والصق محتوى `supabase/schema.sql` ثم Run.
3. من **Project Settings → API** انسخ:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (سيرفر فقط، لا تضف NEXT_PUBLIC)
4. ضع `ADMIN_PASSWORD` و `ADMIN_SESSION_SECRET` في `.env.local`.

بدون Supabase يعمل الموقع بالأدوات الداخلية السبع المدمجة (`lib/builtin-tools.ts`).

## لوحة التحكم

`/ar/admin` أو `/en/admin` — أضف أداة (رابط / iframe / داخلية) وتظهر فوراً في الصفحة الرئيسية.
الأدوات من نوع **internal** تحتاج مكوّناً مبرمجاً في `components/tools/internal.tsx` (سجّله في `registry`).

## إضافة أداة داخلية جديدة

1. أنشئ المكوّن داخل `components/tools/internal.tsx` وأضفه إلى `registry` بنفس الـ slug.
2. أضف سطرها في `lib/builtin-tools.ts` (أو من لوحة التحكم بنوع internal).

## النشر

ارفع المشروع إلى Vercel وأضف متغيرات البيئة نفسها، واضبط `NEXT_PUBLIC_SITE_URL` على دومينك.
الـ Service Worker يعمل في وضع الإنتاج فقط (`npm run build && npm start`).

## الهيكل

```
app/[locale]/(site)/   الرئيسية + صفحات الأدوات (مع الشريط الجانبي)
app/[locale]/admin/    لوحة التحكم + Server Actions
components/            layout / tools / ui
lib/                   supabase, i18n, jsonld, admin-auth
public/sw.js           PWA offline
supabase/schema.sql    جدول الأدوات
```

## ملاحظات أمان

- مصادقة الأدمن بسيطة (كلمة مرور + كوكي HttpOnly). للإنتاج الجاد انتقل إلى Supabase Auth.
- روابط الأدوات تُقبل بـ https فقط، والـ iframe يعمل داخل sandbox.

## النشر على Cloudflare Workers

```bash
npm install
npx wrangler login
npm run deploy
```
- ضع المتغيرات `NEXT_PUBLIC_*` في `.env.local` قبل الأمر (تُدمج وقت البناء).
- الأسرار: `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY` وكذلك `ADMIN_PASSWORD` و `ADMIN_SESSION_SECRET`.
- معاينة محلية: انسخ `.dev.vars.example` إلى `.dev.vars` ثم `npm run preview`.

## الإعلانات (v2)

1. أعد تشغيل `supabase/schema.sql` في SQL Editor (آمن، ينشئ جدول `ads` فقط إن لم يوجد).
2. من `/ar/admin?tab=ads` أضف إعلاناً: بانر (صورة + رابط) / Google AdSense / كود مخصص.
3. أماكن الظهور: أعلى الصفحة، الشريط الجانبي، بين الكروت (إعلان بعد كل 6 أدوات)، أسفل صفحة الأداة.
4. `/ads.txt` يُولَّد تلقائياً من إعلانات AdSense المفعّلة.
