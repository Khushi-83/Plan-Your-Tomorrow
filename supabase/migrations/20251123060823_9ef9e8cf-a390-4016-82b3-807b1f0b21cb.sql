-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  created_at timestamp with time zone not null default now(),
  primary key (id)
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create tasks table
create table public.tasks (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  duration text not null,
  urgency integer not null,
  importance integer not null,
  completed boolean not null default false,
  color text not null,
  notes text,
  task_type text not null check (task_type in ('routine', 'tomorrow')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.tasks enable row level security;

create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can create their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Create task completion history table for streak tracking
create table public.task_completions (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users on delete cascade,
  completion_date date not null,
  completed_count integer not null default 0,
  created_at timestamp with time zone not null default now(),
  unique(user_id, completion_date)
);

alter table public.task_completions enable row level security;

create policy "Users can view their own completions"
  on public.task_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own completions"
  on public.task_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own completions"
  on public.task_completions for update
  using (auth.uid() = user_id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for tasks updated_at
create trigger update_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.update_updated_at_column();