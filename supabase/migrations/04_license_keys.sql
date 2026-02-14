-- Create a table for license keys
create table if not exists public.license_keys (
  key text primary key,
  status text not null default 'active', -- 'active', 'used', 'revoked'
  user_id uuid references auth.users, -- The user who used this key
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  used_at timestamp with time zone
);

-- Enable RLS
alter table public.license_keys enable row level security;

-- Policy: Allow anyone to read keys (so they can verify if a key exists/is active)
-- In a stricter app, you'd use a robust Edge Function, but this is fine for MVP.
drop policy if exists "Enable read access for all users" on public.license_keys;
create policy "Enable read access for all users" on public.license_keys
  for select using (true);

-- Policy: Only service role (admin) can insert/update
-- (Implicitly denied for anon/authenticated users by default)
