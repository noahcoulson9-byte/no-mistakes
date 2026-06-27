-- Daily Debrief schema
-- Run this in the Supabase SQL editor for your project.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "tasks_select_own" on public.tasks
  for select using (auth.uid() = user_id);

create policy "tasks_insert_own" on public.tasks
  for insert with check (auth.uid() = user_id);

create policy "tasks_update_own" on public.tasks
  for update using (auth.uid() = user_id);

create policy "tasks_delete_own" on public.tasks
  for delete using (auth.uid() = user_id);

create table if not exists public.settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  city text not null default 'New York',
  lat double precision not null default 40.7128,
  lon double precision not null default -74.0060,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "settings_select_own" on public.settings
  for select using (auth.uid() = user_id);

create policy "settings_upsert_own" on public.settings
  for insert with check (auth.uid() = user_id);

create policy "settings_update_own" on public.settings
  for update using (auth.uid() = user_id);
