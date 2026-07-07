-- Supabase Schema for Zenth

-- Enable the UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Dumps Table
create table if not exists public.dumps (
    id text primary key,
    user_id text not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Tasks Table
create table if not exists public.tasks (
    id text primary key,
    user_id text not null,
    content text not null,
    status text not null check (status in ('pending', 'completed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone,
    dump_id text references public.dumps(id) on delete cascade
);

-- 3. Create Settings Table
create table if not exists public.settings (
    user_id text primary key,
    focus_duration_minutes integer not null default 25,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS)
alter table public.dumps enable row level security;
alter table public.tasks enable row level security;
alter table public.settings enable row level security;

-- Create Policies to ensure users can only see and modify their own data
-- Note: We are using Clerk for auth, so we extract the user_id from the Clerk JWT.
-- Supabase exposes the JWT payload via the auth.jwt() function.
-- Clerk's user ID is usually stored in the 'sub' field.

-- Dumps Policies
create policy "Users can view their own dumps" on public.dumps
    for select using (auth.uid() = user_id);

create policy "Users can insert their own dumps" on public.dumps
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own dumps" on public.dumps
    for update using (auth.uid() = user_id);

create policy "Users can delete their own dumps" on public.dumps
    for delete using (auth.uid() = user_id);

-- Tasks Policies
create policy "Users can view their own tasks" on public.tasks
    for select using (auth.uid() = user_id);

create policy "Users can insert their own tasks" on public.tasks
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks" on public.tasks
    for update using (auth.uid() = user_id);

create policy "Users can delete their own tasks" on public.tasks
    for delete using (auth.uid() = user_id);

-- Settings Policies
create policy "Users can view their own settings" on public.settings
    for select using (auth.uid() = user_id);

create policy "Users can insert their own settings" on public.settings
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own settings" on public.settings
    for update using (auth.uid() = user_id);

-- Requesting a custom JWT function to map Clerk's 'sub' to auth.uid()
create or replace function auth.uid() returns text as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::text;
$$ language sql stable;
