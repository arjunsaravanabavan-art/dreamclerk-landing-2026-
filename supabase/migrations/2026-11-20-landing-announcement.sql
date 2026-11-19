-- Shared airplane-banner announcement for Blog Studio and the production landing page.
create table if not exists public.landing_announcements (
  id integer primary key default 1 check (id = 1),
  enabled boolean not null default true,
  message text not null default 'Sorry for the inconvenience — we’re making DreamClerk even better. Thanks for being here!',
  interval_seconds integer not null default 60 check (interval_seconds between 30 and 3600),
  updated_at timestamptz not null default now()
);

insert into public.landing_announcements (id)
values (1)
on conflict (id) do nothing;

alter table public.landing_announcements enable row level security;

drop policy if exists "public can read landing announcement" on public.landing_announcements;
create policy "public can read landing announcement"
  on public.landing_announcements for select
  to anon, authenticated
  using (true);

-- Writes are performed only by the Blog Studio server using the primary
-- DreamClerk service-role client. No public INSERT/UPDATE/DELETE policies.
revoke insert, update, delete on public.landing_announcements from anon, authenticated;
grant select on public.landing_announcements to anon, authenticated;

create or replace function public.set_landing_announcement_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists landing_announcements_updated_at on public.landing_announcements;
create trigger landing_announcements_updated_at
  before update on public.landing_announcements
  for each row execute function public.set_landing_announcement_updated_at();
