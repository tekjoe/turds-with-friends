-- Star ratings for location logs
create table public.location_ratings (
  id uuid primary key default gen_random_uuid(),
  location_log_id uuid not null references public.location_logs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now(),
  unique (location_log_id, user_id)
);

-- RLS
alter table public.location_ratings enable row level security;

create policy "Anyone authenticated can read ratings"
  on public.location_ratings for select
  to authenticated
  using (true);

create policy "Users can insert own ratings"
  on public.location_ratings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own ratings"
  on public.location_ratings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for fast aggregation
create index idx_location_ratings_log_id on public.location_ratings(location_log_id);
