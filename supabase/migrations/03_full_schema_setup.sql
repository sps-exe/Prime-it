-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. TASKS Table
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  duration integer default 25,
  column_id text not null, -- 'backlog', 'this-week', 'today', 'done'
  list_id text,
  difficulty text default 'medium',
  created_at bigint not null,
  scheduled_date text,
  completed_at bigint,
  notes text,
  created_at_timestamptz timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. LISTS Table
create table if not exists public.lists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  color text,
  icon text,
  archived boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. FOCUS SESSIONS Table
create table if not exists public.focus_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  task_id uuid, -- Can be null if task deleted
  task_title text,
  list_id text,
  started_at bigint not null,
  ended_at bigint not null,
  focus_time integer not null, -- in seconds
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. USER SETTINGS Table
create table if not exists public.user_settings (
  user_id uuid references auth.users not null primary key,
  onboarding_completed boolean default false,
  theme text default 'dark',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ENABLE RLS (Security)
alter table public.tasks enable row level security;
alter table public.lists enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.user_settings enable row level security;

-- 6. RLS POLICIES (Users can only see/edit their own data)

-- TASKS Policies
drop policy if exists "Users can view their own tasks" on public.tasks;
create policy "Users can view their own tasks" on public.tasks for select using ( auth.uid() = user_id );
drop policy if exists "Users can insert their own tasks" on public.tasks;
create policy "Users can insert their own tasks" on public.tasks for insert with check ( auth.uid() = user_id );
drop policy if exists "Users can update their own tasks" on public.tasks;
create policy "Users can update their own tasks" on public.tasks for update using ( auth.uid() = user_id );
drop policy if exists "Users can delete their own tasks" on public.tasks;
create policy "Users can delete their own tasks" on public.tasks for delete using ( auth.uid() = user_id );

-- LISTS Policies
drop policy if exists "Users can view their own lists" on public.lists;
create policy "Users can view their own lists" on public.lists for select using ( auth.uid() = user_id );
drop policy if exists "Users can insert their own lists" on public.lists;
create policy "Users can insert their own lists" on public.lists for insert with check ( auth.uid() = user_id );
drop policy if exists "Users can update their own lists" on public.lists;
create policy "Users can update their own lists" on public.lists for update using ( auth.uid() = user_id );
drop policy if exists "Users can delete their own lists" on public.lists;
create policy "Users can delete their own lists" on public.lists for delete using ( auth.uid() = user_id );

-- FOCUS SESSIONS Policies
drop policy if exists "Users can view their own sessions" on public.focus_sessions;
create policy "Users can view their own sessions" on public.focus_sessions for select using ( auth.uid() = user_id );
drop policy if exists "Users can insert their own sessions" on public.focus_sessions;
create policy "Users can insert their own sessions" on public.focus_sessions for insert with check ( auth.uid() = user_id );

-- USER SETTINGS Policies
drop policy if exists "Users can view their own settings" on public.user_settings;
create policy "Users can view their own settings" on public.user_settings for select using ( auth.uid() = user_id );
drop policy if exists "Users can update their own settings" on public.user_settings;
create policy "Users can update their own settings" on public.user_settings for update using ( auth.uid() = user_id );
drop policy if exists "Users can insert their own settings" on public.user_settings;
create policy "Users can insert their own settings" on public.user_settings for insert with check ( auth.uid() = user_id );
