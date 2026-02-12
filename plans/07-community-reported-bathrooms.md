# 07 — Community-Reported Bathrooms

## Overview

Let users add bathrooms to a shared community database with metadata like accessibility, whether it's free or paid, and quality tags. Separate from personal movement logs — these are shared resources for all users.

## Effort

High — new database table, full CRUD API, new UI components, moderation considerations.

## Implementation Steps

### 1. Database migration

Create `supabase/migrations/YYYYMMDD000000_community_bathrooms.sql`:

```sql
create table public.community_bathrooms (
  id uuid primary key default gen_random_uuid(),
  reported_by uuid not null references auth.users(id),
  latitude double precision not null,
  longitude double precision not null,
  name text not null,
  address text,
  wheelchair_accessible boolean default null,
  changing_table boolean default null,
  gender_neutral boolean default null,
  single_occupancy boolean default null,
  requires_purchase boolean default null,
  is_free boolean default null,
  notes text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Spatial index for geolocation queries
create index idx_community_bathrooms_coords
  on public.community_bathrooms (latitude, longitude);

-- RLS
alter table public.community_bathrooms enable row level security;

create policy "Anyone can read community bathrooms"
  on public.community_bathrooms for select using (true);

create policy "Authenticated users can insert bathrooms"
  on public.community_bathrooms for insert
  with check (auth.uid() = reported_by);

create policy "Users can update own reported bathrooms"
  on public.community_bathrooms for update
  using (auth.uid() = reported_by);

-- Ratings table for community bathrooms
create table public.community_bathroom_ratings (
  id uuid primary key default gen_random_uuid(),
  bathroom_id uuid not null references public.community_bathrooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  cleanliness smallint check (cleanliness >= 1 and cleanliness <= 5),
  privacy smallint check (privacy >= 1 and privacy <= 5),
  overall smallint not null check (overall >= 1 and overall <= 5),
  created_at timestamptz not null default now(),
  unique (bathroom_id, user_id)
);

alter table public.community_bathroom_ratings enable row level security;

create policy "Anyone can read bathroom ratings"
  on public.community_bathroom_ratings for select using (true);

create policy "Users can rate bathrooms"
  on public.community_bathroom_ratings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ratings"
  on public.community_bathroom_ratings for update
  using (auth.uid() = user_id);
```

### 2. Regenerate types

```bash
supabase gen types typescript --local > src/types/database.ts
```

### 3. API routes

**`src/app/api/community-bathrooms/route.ts`**

- `GET ?lat=X&lng=Y&radius=2000` — Fetch community bathrooms within radius, include average ratings
- `POST` — Report a new bathroom: `{ latitude, longitude, name, address?, ...amenity flags }`

**`src/app/api/community-bathrooms/[id]/rate/route.ts`**

- `POST` — Rate a bathroom: `{ overall, cleanliness?, privacy? }` (upsert)

### 4. "Report Bathroom" modal: `src/components/map/ReportBathroomModal.tsx`

Triggered by a "Report a Bathroom" button on the map. Steps:

1. **Location**: Drop a pin on the map or use current location
2. **Name**: Text input (required) — e.g., "Starbucks on 5th Ave"
3. **Address**: Text input (optional)
4. **Amenities**: Toggle switches for:
   - Wheelchair accessible
   - Changing table
   - Gender neutral
   - Single occupancy
   - Requires purchase
   - Free to use
5. **Notes**: Optional textarea
6. **Submit**: POST to API

### 5. Map integration

In `MapInner.tsx`:

- Fetch community bathrooms alongside OSM bathrooms (or as a replacement if the Overpass feature isn't implemented yet)
- Render with a distinct pin icon (e.g., a purple toilet icon with a community badge)
- Popup shows: name, address, amenity tags as badges, average rating, "Rate This" button
- Community-reported bathrooms and OSM bathrooms should be visually distinguishable

### 6. "Report Bathroom" button in `PoopMap.tsx`

Add a floating action button or a button in the options panel:

```tsx
<button onClick={() => setShowReportModal(true)}>
  <Icon name="add_location" />
  Report a Bathroom
</button>
```

### 7. Pin icon for community bathrooms

```typescript
const communityBathroomIcon = new L.DivIcon({
  html: `<div class="community-bathroom-pin"><span class="material-symbols-rounded">family_restroom</span></div>`,
  className: "",
  iconSize: [36, 36],
});
```

## Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/YYYYMMDD_community_bathrooms.sql` | New migration |
| `src/types/database.ts` | Regenerated |
| `src/app/api/community-bathrooms/route.ts` | New: list + create |
| `src/app/api/community-bathrooms/[id]/rate/route.ts` | New: rate a bathroom |
| `src/components/map/ReportBathroomModal.tsx` | New: report form |
| `src/components/map/MapInner.tsx` | Render community bathroom pins |
| `src/components/map/PoopMap.tsx` | Add "Report Bathroom" button + toggle |
| `src/app/globals.css` | Community bathroom pin styles |

## Moderation Considerations

- `verified` column defaults to false — future admin verification flow
- Consider adding a `reports` counter for flagging inappropriate entries
- Rate-limit bathroom creation (e.g., max 10 per day per user)

## Testing

- Report a new bathroom with all amenity flags → verify it appears on the map
- Rate a community bathroom → verify average updates
- Verify amenity badges display correctly in the popup
- Verify only the reporting user can edit their bathroom entry
- Test near-location queries return correct results
