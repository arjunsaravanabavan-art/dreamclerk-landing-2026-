-- Notify Me server-side IP rate limiting.
-- Public clients must submit through the notify-submit Edge Function.
create table if not exists public.notify_rate_limit_buckets (
  key_hash text not null,
  window_type text not null check (window_type in ('10m','1d')),
  window_start timestamptz not null,
  attempts integer not null default 0,
  primary key (key_hash, window_type, window_start)
);
alter table public.notify_rate_limit_buckets enable row level security;
revoke all on public.notify_rate_limit_buckets from anon, authenticated;
grant all on public.notify_rate_limit_buckets to service_role;

create or replace function public.consume_notify_rate_limit(p_key_hash text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_10m timestamptz;
  v_day timestamptz;
  v_short_count integer;
  v_daily_count integer;
begin
  if p_key_hash is null or length(p_key_hash) < 32 or length(p_key_hash) > 128 then
    return false;
  end if;
  v_10m := to_timestamp(floor(extract(epoch from v_now) / 600) * 600);
  v_day := date_trunc('day', v_now);

  insert into public.notify_rate_limit_buckets(key_hash, window_type, window_start, attempts)
  values (p_key_hash, '10m', v_10m, 1)
  on conflict (key_hash, window_type, window_start)
  do update set attempts = public.notify_rate_limit_buckets.attempts + 1
  returning attempts into v_short_count;

  insert into public.notify_rate_limit_buckets(key_hash, window_type, window_start, attempts)
  values (p_key_hash, '1d', v_day, 1)
  on conflict (key_hash, window_type, window_start)
  do update set attempts = public.notify_rate_limit_buckets.attempts + 1
  returning attempts into v_daily_count;

  return v_short_count <= 3 and v_daily_count <= 10;
end;
$$;
revoke all on function public.consume_notify_rate_limit(text) from public, anon, authenticated;
grant execute on function public.consume_notify_rate_limit(text) to service_role;

drop policy if exists "public can insert notify_signups" on public.notify_signups;
