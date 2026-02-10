-- 1. Create the subscriptions table
create table public.subscriptions (
  id uuid references auth.users not null primary key,
  status text not null, -- 'active', 'cancelled', 'expired', 'past_due'
  variant_id text, -- The ID of the product or variant from LemonSqueezy
  customer_id text, -- LemonSqueezy Customer ID
  order_id text, -- LemonSqueezy Order ID
  renews_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.subscriptions enable row level security;

-- 3. Create Policy: Users can only read their own subscription
create policy "Users can read own subscription" on public.subscriptions
  for select using (auth.uid() = id);

-- 4. Create Policy: Service functions (our webhook) can do everything
-- Note: Service role bypasses RLS, but explicit policy is good practice if using restricted role
-- For now, default service role access is sufficient.

-- 5. Create a function to update 'updated_at' automatically
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_subscription_updated
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();
