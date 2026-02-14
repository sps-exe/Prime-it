-- Function to check subscription status (bypasses RLS)
create or replace function public.check_subscription(p_user_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_result jsonb;
begin
  select jsonb_build_object(
    'status', s.status,
    'variant_id', s.variant_id
  ) into v_result
  from public.subscriptions s
  where s.id = p_user_id;

  if v_result is null then
    return jsonb_build_object('status', 'none');
  end if;

  return v_result;
end;
$$;

-- Reset TEST-KEY-123 for testing
update public.license_keys 
set status = 'active', user_id = null, used_at = null 
where key = 'TEST-KEY-123';

-- Remove test subscription to test fresh
delete from public.subscriptions 
where id = '797c97ae-72da-4686-b4f7-735861f7457f';
