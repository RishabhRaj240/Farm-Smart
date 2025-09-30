-- Create newsletter_subscribers table
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamp with time zone default now()
);

-- Enable RLS and allow inserts for anon (public) only into email column
alter table public.newsletter_subscribers enable row level security;

create policy "Allow insert for anon" on public.newsletter_subscribers
  for insert to anon
  with check (true);

create policy "Allow read for authenticated" on public.newsletter_subscribers
  for select to authenticated
  using (true);


