-- Allow authenticated users to UPDATE license_keys (to claim a key)
drop policy if exists "Authenticated users can claim keys" on public.license_keys;
create policy "Authenticated users can claim keys" on public.license_keys
  for update using (status = 'active')
  with check (true);

-- Allow authenticated users to INSERT their own subscription
drop policy if exists "Users can insert own subscription" on public.subscriptions;
create policy "Users can insert own subscription" on public.subscriptions
  for insert with check (auth.uid() = id);

-- Allow authenticated users to UPDATE their own subscription
drop policy if exists "Users can update own subscription" on public.subscriptions;
create policy "Users can update own subscription" on public.subscriptions
  for update using (auth.uid() = id);
