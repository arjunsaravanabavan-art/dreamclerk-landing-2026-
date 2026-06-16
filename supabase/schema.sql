-- =============================================================================
-- DreamClerk — Supabase schema
-- =============================================================================
-- Run this once in the Supabase SQL editor:
--   1. https://hmeglzxbxbqetgydkynl.supabase.co
--   2. SQL editor → New query → paste → Run
--
-- If you see `column "id" of relation "waitlist_count" does not exist`,
-- you have a leftover table from an earlier schema. Run
-- `fix-waitlist-count.sql` first, then re-run this file.
--
-- Creates:
--   1. subscribers (waitlist count source)
--   2. notify_signups (get-notified form on landing)
--   3. posts (blog — public read, admin-only write)
--   4. waitlist_count (single-row counter)
--   5. get_waitlist_count() + bump_waitlist_count() RPCs
--   6. RLS policies (public read, admin write)
--
-- After this runs:
--   - Create your admin user: supabase-auth-users table → Add user
--   - Set the email to the value of VITE_ADMIN_EMAIL (admin@dreamclerk.in by default)
--   - The RLS policies automatically gate writes to that email.
-- =============================================================================

-- ─── 1. subscribers (legacy waitlist — for the homepage stat) ──────────────
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  source text default 'modal',
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

drop policy if exists "public can insert subscribers" on public.subscribers;
create policy "public can insert subscribers"
  on public.subscribers for insert
  with check (true);

-- ─── 2. notify_signups (get-notified form) ──────────────────────────────────
create table if not exists public.notify_signups (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  source text default 'modal',
  created_at timestamptz not null default now()
);

alter table public.notify_signups enable row level security;

drop policy if exists "public can insert notify_signups" on public.notify_signups;
create policy "public can insert notify_signups"
  on public.notify_signups for insert
  with check (true);

-- ─── 3. waitlist_count (single-row counter — homepage stat) ────────────────
-- Drop and recreate to avoid schema drift on re-runs (the old
-- waitlist_count may not have an `id` column).
drop table if exists public.waitlist_count cascade;
drop function if exists public.get_waitlist_count() cascade;
drop function if exists public.bump_waitlist_count() cascade;

create table public.waitlist_count (
  id int primary key default 1,
  value int not null default 1847,
  updated_at timestamptz not null default now()
);

insert into public.waitlist_count (id, value) values (1, 1847)
  on conflict (id) do nothing;

alter table public.waitlist_count enable row level security;

drop policy if exists "public can read waitlist_count" on public.waitlist_count;
create policy "public can read waitlist_count"
  on public.waitlist_count for select
  using (true);

create or replace function public.get_waitlist_count()
returns int
language sql
security definer
set search_path = public
stable
as $$
  select value from public.waitlist_count where id = 1;
$$;

grant execute on function public.get_waitlist_count() to anon, authenticated;

create or replace function public.bump_waitlist_count()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  new_value int;
begin
  insert into public.waitlist_count (id, value, updated_at)
    values (1, 1848, now())
    on conflict (id) do update
      set value = public.waitlist_count.value + 1,
          updated_at = now()
  returning value into new_value;
  return new_value;
end;
$$;

grant execute on function public.bump_waitlist_count() to anon, authenticated;

-- ─── 4. posts (blog) ────────────────────────────────────────────────────────
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text not null default '',
  cover_image text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  author_name text not null default 'DreamClerk',
  reading_time int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (published, published_at desc);

create index if not exists posts_slug_idx
  on public.posts (slug);

alter table public.posts enable row level security;

-- Public read — only published posts, only the safe columns
drop policy if exists "public can read published posts" on public.posts;
create policy "public can read published posts"
  on public.posts for select
  using (published = true);

-- Authed admin (single user) can read + write everything
drop policy if exists "admin can read all posts" on public.posts;
create policy "admin can read all posts"
  on public.posts for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'admin@dreamclerk.in');

drop policy if exists "admin can insert posts" on public.posts;
create policy "admin can insert posts"
  on public.posts for insert
  to authenticated
  with check (auth.jwt() ->> 'email' = 'admin@dreamclerk.in');

drop policy if exists "admin can update posts" on public.posts;
create policy "admin can update posts"
  on public.posts for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'admin@dreamclerk.in')
  with check (auth.jwt() ->> 'email' = 'admin@dreamclerk.in');

drop policy if exists "admin can delete posts" on public.posts;
create policy "admin can delete posts"
  on public.posts for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'admin@dreamclerk.in');

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();
