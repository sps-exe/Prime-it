-- Final reset: clean slate for in-app testing
update public.license_keys 
set status = 'active', user_id = null, used_at = null 
where key = 'TEST-KEY-123';

delete from public.subscriptions 
where id = '797c97ae-72da-4686-b4f7-735861f7457f';
