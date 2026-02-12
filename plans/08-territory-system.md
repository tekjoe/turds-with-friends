# 08 — Territory System

## Overview

Divide the map into geographic hex zones. Users claim territory by logging movements in a zone. The user with the most logs in a zone "owns" it, displayed in their color on the map. Inspired by Foursquare's check-in mechanics.

## Effort

High — requires geospatial computation, new database tables, map overlay rendering, and territory competition logic.

## Geospatial Approach

Use **H3 hex grid** (Uber's open-source hierarchical geospatial indexing) at resolution 8 (~460m edge length, ~0.74 km² area). This gives neighborhoods-sized zones that are fun to compete over.

Library: `h3-js` (npm package)

## Implementation Steps

### 1. Install dependency

```bash
npm install h3-js
```

### 2. Database migration

Create `supabase/migrations/YYYYMMDD000000_territories.sql`:

```sql
-- Materialized view or table tracking territory ownership
create table public.territory_claims (
  h3_index text not null,
  user_id uuid not null references auth.users(id),
  log_count integer not null default 1,
  last_logged_at timestamptz not null default now(),
  primary key (h3_index, user_id)
);

-- The current owner of each territory (user with most logs)
create index idx_territory_claims_h3 on public.territory_claims(h3_index);
create index idx_territory_claims_user on public.territory_claims(user_id);

-- RLS
alter table public.territory_claims enable row level security;

create policy "Anyone can read territory claims"
  on public.territory_claims for select using (true);

create policy "System manages territory claims"
  on public.territory_claims for all using (true);
```

### 3. Territory computation: `src/lib/territory.ts`

```typescript
import { latLngToCell } from "h3-js";

const H3_RESOLUTION = 8;

export function getH3Index(lat: number, lng: number): string {
  return latLngToCell(lat, lng, H3_RESOLUTION);
}
```

### 4. Update territory claims on location log

When a user creates a location log, update `territory_claims`:

**Option A — Trigger in API route** (`src/app/api/locations/route.ts`):

After inserting the location log, upsert into `territory_claims`:

```sql
INSERT INTO territory_claims (h3_index, user_id, log_count, last_logged_at)
VALUES ($1, $2, 1, now())
ON CONFLICT (h3_index, user_id)
DO UPDATE SET log_count = territory_claims.log_count + 1, last_logged_at = now();
```

**Option B — Database trigger** (more reliable):

```sql
create or replace function update_territory_claim()
returns trigger as $$
begin
  -- Compute H3 index in application layer and pass as column, OR
  -- use PostGIS extension for server-side computation
  -- For simplicity, this will be handled in application code
  return new;
end;
$$ language plpgsql;
```

**Recommended: Option A** (simpler, no PostGIS dependency).

### 5. API route: `src/app/api/territories/route.ts`

**GET** — Returns territory data for the visible map area:

```typescript
// GET /api/territories?bounds=lat1,lng1,lat2,lng2
```

1. Compute all H3 indexes in the bounding box using `polygonToCells`
2. Query `territory_claims` for those H3 indexes
3. For each zone, determine the owner (user with highest `log_count`)
4. Return: `{ territories: [{ h3Index, ownerId, ownerName, ownerColor, logCount }] }`

Assign colors to users: hash user ID to a color from a palette.

### 6. Map overlay: `src/components/map/TerritoryLayer.tsx`

- Render H3 hexagons as polygons on the map using `react-leaflet`'s `<Polygon>` component
- Each hex colored by its owner with transparency (e.g., `fillOpacity: 0.25`)
- On click, show a popup: "Owned by {userName} ({logCount} logs)"
- Use `cellToBoundary` from `h3-js` to get polygon coordinates

```typescript
import { cellToBoundary } from "h3-js";

const boundary = cellToBoundary(h3Index, true); // [lng, lat] pairs
const latLngs = boundary.map(([lng, lat]) => [lat, lng] as [number, number]);
```

### 7. Toggle in `PoopMap.tsx`

Add a "Show Territories" toggle in the options panel. When enabled:
- Fetch territories for the current map bounds
- Render `<TerritoryLayer>`
- Re-fetch on map pan/zoom (debounced)

### 8. Territory stats

Add to the Map Stats Bar (plan 05):
- "Zones Claimed: X" — count of zones where the user is the top logger
- "Total Zones Visited: Y" — count of zones where the user has any logs

### 9. Color assignment

Assign a deterministic color to each user based on their user ID:

```typescript
const TERRITORY_COLORS = [
  "#C05621", "#3B82F6", "#8B5CF6", "#EC4899",
  "#14B8A6", "#F59E0B", "#EF4444", "#6366F1",
];

function getUserColor(userId: string): string {
  const hash = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return TERRITORY_COLORS[hash % TERRITORY_COLORS.length];
}
```

The current user's territories use the primary color.

## Files Changed

| File | Change |
|------|--------|
| `package.json` | Add `h3-js` dependency |
| `supabase/migrations/YYYYMMDD_territories.sql` | New migration |
| `src/types/database.ts` | Regenerated |
| `src/lib/territory.ts` | New: H3 utilities |
| `src/app/api/locations/route.ts` | Upsert territory claim after location log |
| `src/app/api/territories/route.ts` | New: fetch territories for bounding box |
| `src/components/map/TerritoryLayer.tsx` | New: render hex polygons |
| `src/components/map/MapInner.tsx` | Integrate TerritoryLayer |
| `src/components/map/PoopMap.tsx` | Add "Show Territories" toggle |

## Performance Considerations

- H3 resolution 8: ~460m edge. Resolution 7 (~1.2km) if performance is an issue.
- Limit territory fetch to visible map bounds
- Cache territory data client-side, invalidate on new log
- At extreme zoom-out, hide territories or aggregate to lower H3 resolution

## Testing

- Log at a location → verify a territory claim is created
- Log multiple times in the same hex → verify count increments
- Second user logs in same hex → verify ownership goes to higher count
- Toggle territories on/off on the map
- Pan map and verify new territories load
- Verify territory color matches the owning user
