-- Insert a fresh test license key
-- Also reset the old one if it exists
update public.license_keys 
set status = 'active', user_id = null, used_at = null 
where key = 'TEST-KEY-123';

-- Insert a new clean key for testing
insert into public.license_keys (key, status) 
values ('PRO-2024-ABCD', 'active')
on conflict (key) do update set status = 'active', user_id = null, used_at = null;
