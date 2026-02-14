-- Create a function to securely claim a license key
-- This runs with "security definer" meaning it bypasses RLS policies (runs as admin/postgres role)
create or replace function public.claim_license_key(p_key text)
returns boolean
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_key_exists boolean;
begin
  -- Get current user ID
  v_user_id := auth.uid();
  
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- 1. Check if key is valid and active (and exists)
  select exists(
    select 1 from public.license_keys 
    where key = p_key and status = 'active'
  ) into v_key_exists;

  if not v_key_exists then
    return false; -- Key invalid or already used
  end if;

  -- 2. Mark key as used
  update public.license_keys
  set status = 'used',
      user_id = v_user_id,
      used_at = now()
  where key = p_key;

  -- 3. Grant Subscription (Upsert)
  insert into public.subscriptions (id, status, variant_id, renews_at, updated_at)
  values (v_user_id, 'active', 'lifetime_license', null, now())
  on conflict (id) do update
  set status = 'active',
      variant_id = 'lifetime_license',
      renews_at = null,
      updated_at = now();

  return true;
end;
$$;
