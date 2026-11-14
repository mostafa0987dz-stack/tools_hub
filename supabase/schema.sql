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
