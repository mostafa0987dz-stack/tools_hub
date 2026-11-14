-- Run in Supabase: SQL Editor
create table if not exists public.tools (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name_ar         text not null,
  name_en         text not null,
  description_ar  text,
  description_en  text,
  category        text not null check (category in ('text','image','pdf','dev','other')),
  icon            text default 'Wrench',
  kind            text not null check (kind in ('internal','link','iframe')),
  url             text,
  is_published    boolean default true,
  created_at      timestamptz default now()
);

create index if not exists tools_category_idx on public.tools (category);

-- Public can read published tools. Writes go through service_role only (server actions).
alter table public.tools enable row level security;

drop policy if exists "public read published tools" on public.tools;
create policy "public read published tools"
  on public.tools for select
  using (is_published = true);

-- =========================================================
-- Ads (v2) — run again safely; everything is idempotent
-- =========================================================
create table if not exists public.ads (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  type            text not null check (type in ('banner','adsense','code')),
  placement       text not null check (placement in ('top','sidebar','grid','tool_bottom')),
  locale          text not null default 'all' check (locale in ('all','ar','en')),
  priority        int  not null default 0,
  image_url       text,
  link_url        text,
  adsense_client  text,
  adsense_slot    text,
  code            text,
  height          int,
  is_active       boolean not null default true,
  created_at      timestamptz default now()
);

create index if not exists ads_placement_idx on public.ads (placement, is_active);

alter table public.ads enable row level security;

drop policy if exists "public read active ads" on public.ads;
create policy "public read active ads"
  on public.ads for select
  using (is_active = true);
-- Writes happen only through service_role (admin server actions).
