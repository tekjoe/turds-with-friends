-- Territory claims table for H3 hex-grid territory system
create table public.territory_claims (
  id uuid primary key default gen_random_uuid(),
  h3_index text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  log_count integer not null default 1,
  last_claimed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint territory_claims_h3_user_unique unique (h3_index, user_id)
);

-- Indexes for efficient lookups
create index idx_territory_claims_h3 on public.territory_claims (h3_index);
create index idx_territory_claims_user on public.territory_claims (user_id);
create index idx_territory_claims_h3_count on public.territory_claims (h3_index, log_count desc);

-- RLS
alter table public.territory_claims enable row level security;

create policy "Anyone authenticated can read territory claims"
  on public.territory_claims for select
  to authenticated
  using (true);

create policy "Users can insert their own territory claims"
  on public.territory_claims for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own territory claims"
  on public.territory_claims for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Atomic upsert function
create or replace function public.upsert_territory_claim(p_h3_index text, p_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.territory_claims (h3_index, user_id, log_count, last_claimed_at)
  values (p_h3_index, p_user_id, 1, now())
  on conflict (h3_index, user_id)
  do update set
    log_count = territory_claims.log_count + 1,
    last_claimed_at = now();
end;
$$;
