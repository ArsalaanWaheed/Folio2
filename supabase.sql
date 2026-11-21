-- Run once in the Supabase SQL Editor before enabling remote storage.
create table if not exists public.portfolio_records (
  key text primary key,
  value jsonb not null,
  revision text,
  constraint portfolio_record_shape check (
    (key = 'content' and jsonb_typeof(value) = 'object' and revision is not null)
    or
    (key ~ '^image:[a-f0-9]{64}\.webp$' and jsonb_typeof(value) = 'string' and revision is null)
  )
);

alter table public.portfolio_records enable row level security;
revoke all on table public.portfolio_records from anon, authenticated, public;
grant select, insert, update on table public.portfolio_records to service_role;
notify pgrst, 'reload schema';
