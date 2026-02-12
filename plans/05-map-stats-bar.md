# 05 — Map Statistics Bar

## Overview

Display a stats summary bar above the map showing key location metrics: total pins, unique locations, cities/regions visited, and average rating.

## Effort

Low — frontend component using existing data, no new API endpoints needed.

## Implementation Steps

### 1. Compute stats in `src/app/(authenticated)/map/page.tsx`

The server component already fetches the user's `location_logs` with `place_name`, `latitude`, `longitude`, and `created_at`. Compute the stats server-side:

```typescript
const totalPins = myLocations.length;

// Unique locations by place_name (deduplicated)
const uniquePlaces = new Set(
  myLocations.map((l) => l.place_name).filter(Boolean)
).size;

// Unique cities: extract city from place_name (usually the format is "Place, City" or similar)
// Or group by lat/lng rounded to 2 decimals (~1km)
const uniqueAreas = new Set(
  myLocations.map((l) => `${l.latitude.toFixed(2)},${l.longitude.toFixed(2)}`)
).size;

// First pin date
const firstPinDate = myLocations.length > 0
  ? myLocations[myLocations.length - 1].created_at
  : null;
```

Pass these as props to the map client component.

### 2. Create `src/components/map/MapStatsBar.tsx`

```typescript
interface MapStatsBarProps {
  totalPins: number;
  uniqueLocations: number;
  uniqueAreas: number;
  firstPinDate: string | null;
}
```

Render a horizontal row of stat cards above the map:

| Stat | Icon | Label | Value |
|------|------|-------|-------|
| Total Pins | `location_on` | Pins Dropped | `{totalPins}` |
| Unique Spots | `place` | Unique Spots | `{uniqueLocations}` |
| Areas Explored | `explore` | Areas | `{uniqueAreas}` |
| Tracking Since | `calendar_today` | Tracking Since | `{formatted date}` |

Styling:
- Row of cards: `flex gap-4 overflow-x-auto` with horizontal scroll on mobile
- Each card: `bg-card border border-card-border rounded-xl px-4 py-3 flex items-center gap-3`
- Icon in a colored circle, label in `text-xs text-muted-foreground`, value in `text-lg font-bold`

### 3. Integrate into map page

In `src/app/(authenticated)/map/page.tsx`, render `<MapStatsBar>` above the `<PoopMap>` component:

```tsx
<div className="min-h-screen bg-background pt-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
    <MapStatsBar
      totalPins={totalPins}
      uniqueLocations={uniquePlaces}
      uniqueAreas={uniqueAreas}
      firstPinDate={firstPinDate}
    />
    <PoopMap ... />
  </div>
</div>
```

### 4. Empty state

If no pins exist, the stats bar should show zeros or be hidden entirely (the existing empty state message handles the case where the user hasn't enabled location tracking).

## Files Changed

| File | Change |
|------|--------|
| `src/components/map/MapStatsBar.tsx` | New component |
| `src/app/(authenticated)/map/page.tsx` | Compute stats, render MapStatsBar |

## Testing

- Verify stats display correctly with various pin counts
- Verify stats update after logging a new movement with location
- Verify horizontal scroll works on mobile
- Verify empty state (zero pins) looks correct
