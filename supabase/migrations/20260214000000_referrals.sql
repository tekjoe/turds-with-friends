-- Referral system: invite codes and XP rewards
-- Each user gets a unique invite code. When a new user signs up with it,
-- both referrer and referred user receive 100 XP.

create table if not exists public.referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_id uuid not null references public.profiles(id) on delete cascade,
  invite_code text not null,
  xp_awarded boolean default false,
  created_at timestamptz default now() not null,

  constraint referrals_unique_referred unique (referred_id)
);

-- Add invite_code column to profiles
alter table public.profiles
  add column if not exists invite_code text unique;

-- Generate invite codes for existing users
update public.profiles
set invite_code = upper(substr(md5(id::text || now()::text), 1, 8))
where invite_code is null;

-- Index for fast invite code lookups
create index if not exists idx_referrals_invite_code on public.referrals(invite_code);
create index if not exists idx_profiles_invite_code on public.profiles(invite_code);
create index if not exists idx_referrals_referrer_id on public.referrals(referrer_id);

-- RLS policies
alter table public.referrals enable row level security;

-- Users can view their own referrals (as referrer)
create policy "Users can view own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id);

-- Only the system (service role) should insert referrals
create policy "Service role can insert referrals"
  on public.referrals for insert
  with check (true);

-- Function to generate invite code for new users
create or replace function public.generate_invite_code()
returns trigger as $$
begin
  if new.invite_code is null then
    new.invite_code := upper(substr(md5(new.id::text || now()::text), 1, 8));
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-generate invite codes
drop trigger if exists generate_invite_code_trigger on public.profiles;
create trigger generate_invite_code_trigger
  before insert on public.profiles
  for each row
  execute function public.generate_invite_code();
