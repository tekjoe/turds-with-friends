# 02 — Star Ratings for Locations

## Overview

Allow users to rate bathrooms/locations on a 1-5 star scale when viewing a pin. Display aggregate ratings on pins and in popups.

## Effort

Medium — requires a new database table, API endpoint, and UI changes.

## Implementation Steps

### 1. Database migration

Create `supabase/migrations/YYYYMMDD000000_location_ratings.sql`:

```sql
create table public.location_ratings (
  id uuid primary key default gen_random_uuid(),
  location_log_id uuid not null references public.location_logs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now(),
  unique (location_log_id, user_id)
);

-- RLS
alter table public.location_ratings enable row level security;

create policy "Users can read all ratings"
  on public.location_ratings for select using (true);

create policy "Users can insert own ratings"
  on public.location_ratings for insert with check (auth.uid() = user_id);

create policy "Users can update own ratings"
  on public.location_ratings for update using (auth.uid() = user_id);

-- Index for fast aggregation
create index idx_location_ratings_log_id on public.location_ratings(location_log_id);
```

### 2. Regenerate database types

```bash
supabase gen types typescript --local > src/types/database.ts
```

### 3. API route: `src/app/api/locations/[id]/ratings/route.ts`

**GET** — Returns the aggregate rating and the current user's rating for a location:

```typescript
// Response: { average: number, count: number, userRating: number | null }
```

- Query `location_ratings` where `location_log_id = id`
- Calculate average and count
- Find the current user's rating if it exists

**POST** — Upsert a rating:

```typescript
// Body: { rating: number }
// Upsert into location_ratings (location_log_id, user_id, rating)
// on conflict (location_log_id, user_id) do update set rating
```

### 4. Star rating component: `src/components/map/StarRating.tsx`

- Props: `locationLogId: string`, `initialAverage?: number`, `initialCount?: number`, `initialUserRating?: number | null`
- Renders 5 star icons (filled/empty/half)
- Shows average rating and count: "4.2 (12 ratings)"
- On hover, stars highlight to preview selection
- On click, calls the POST endpoint and optimistically updates UI

### 5. Update `MapInner.tsx` pin popups

- In each `<Popup>`, add `<StarRating>` component below the place name and timestamp
- Pass location log ID and any pre-fetched rating data

### 6. Pre-fetch ratings in `map/page.tsx`

- After fetching location logs, also fetch aggregate ratings for all user's location IDs in a single query
- Pass ratings data to `PoopMap` → `MapInner` as a `Map<string, { average: number; count: number }>`

### 7. Cluster tooltip enhancement (optional)

- Show average rating of pins within a cluster on hover

## Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/YYYYMMDD_location_ratings.sql` | New migration |
| `src/types/database.ts` | Regenerated |
| `src/app/api/locations/[id]/ratings/route.ts` | New API route |
| `src/components/map/StarRating.tsx` | New component |
| `src/components/map/MapInner.tsx` | Add StarRating to popups |
| `src/app/(authenticated)/map/page.tsx` | Pre-fetch ratings data |

## Testing

- Rate a location and verify the star count updates
- Re-rate and verify it updates (upsert, not duplicate)
- Verify a second user sees the first user's rating reflected in the average
- Verify ratings display correctly in pin popups
- Test with no ratings (should show "No ratings yet")
