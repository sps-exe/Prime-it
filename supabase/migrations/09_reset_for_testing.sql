-- Reset TEST-KEY-123 back to active for in-app testing
update public.license_keys 
set status = 'active', user_id = null, used_at = null 
where key = 'TEST-KEY-123';

-- Also remove the subscription we created during curl testing
delete from public.subscriptions 
where id = '797c97ae-72da-4686-b4f7-735861f7457f';
