-- Enable RLS on all tables
alter table public.tasks enable row level security;
alter table public.lists enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;

-- Policies for TASKS
create policy "Users can view their own tasks"
  on public.tasks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own tasks"
  on public.tasks for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using ( auth.uid() = user_id );

-- Policies for LISTS
create policy "Users can view their own lists"
  on public.lists for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own lists"
  on public.lists for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own lists"
  on public.lists for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own lists"
  on public.lists for delete
  using ( auth.uid() = user_id );

-- Policies for FOCUS SESSIONS
create policy "Users can view their own sessions"
  on public.focus_sessions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own sessions"
  on public.focus_sessions for insert
  with check ( auth.uid() = user_id );

-- Policies for PROFILES
create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Policies for USER SETTINGS
create policy "Users can view their own settings"
  on public.user_settings for select
  using ( auth.uid() = user_id );

create policy "Users can update their own settings"
  on public.user_settings for update
  using ( auth.uid() = user_id );

create policy "Users can insert their own settings"
  on public.user_settings for insert
  with check ( auth.uid() = user_id );
