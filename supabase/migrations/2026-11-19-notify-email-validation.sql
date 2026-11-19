-- Enforce Notify Me email validation at the database boundary.
-- Apply this migration in the Supabase SQL editor for the live project.

alter table public.notify_signups
  drop constraint if exists notify_signups_email_valid;

alter table public.notify_signups
  add constraint notify_signups_email_valid
  check (
    length(email) <= 254
    and email ~* '^[A-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Z0-9]([A-Z0-9-]{0,61}[A-Z0-9])?(\\.[A-Z0-9]([A-Z0-9-]{0,61}[A-Z0-9])?)+$'
    and split_part(email, '@', 1) !~* '(asshole|arsehole|bastard|bitch|bullshit|dick|fuck|motherfucker|nigger|piss|shit|slut|whore)'
  );
