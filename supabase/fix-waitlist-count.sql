-- Run this once in Supabase → SQL Editor to clear the "column id does not exist" error.
-- It drops any pre-existing `waitlist_count` table and recreates it with the
-- current schema (id primary key, value int, updated_at). Safe to re-run.

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
