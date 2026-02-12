# 09 — Map Filters Panel

## Overview

Add a collapsible filter panel above or beside the map to filter pins by date range, Bristol type, friend, and rating.

## Effort

Medium — frontend filtering logic with minor server-side data enrichment.

## Implementation Steps

### 1. Enrich pin data with Bristol type

The current map page fetches `location_logs` with `movement_log_id` but doesn't join `movement_logs` to get Bristol type. Update the server query in `src/app/(authenticated)/map/page.tsx`:

```typescript
// Current:
.select("id, movement_log_id, latitude, longitude, place_name, created_at")

// Updated — join movement_logs to get bristol_type:
.select("id, movement_log_id, latitude, longitude, place_name, created_at, movement_logs(bristol_type, logged_at)")
```

Do the same for friend location logs.

### 2. Update types

Update the `LocationPin` interface used throughout the map components to include:

```typescript
interface LocationPin {
  id: string;
  latitude: number;
  longitude: number;
  place_name: string | null;
  created_at: string;
  bristol_type?: number;
  logged_at?: string;
  user_id?: string;       // for friend filtering
  user_name?: string;     // for friend filtering
}
```

### 3. Create `src/components/map/MapFilters.tsx`

A collapsible filter panel with the following controls:

**Date Range**:
- Preset buttons: "All Time", "This Week", "This Month", "Last 30 Days", "Custom"
- Custom: two date inputs (from/to)

**Bristol Type**:
- Checkboxes or toggle buttons for types 1-7
- Color-coded to match Bristol scale colors
- "All" toggle to select/deselect all

**Friend Filter** (when "Show Friends" is on):
- Dropdown or checkbox list of friends
- "All Friends" toggle
- Only visible when showFriends is enabled

**Rating Filter** (if star ratings are implemented):
- Minimum rating slider or buttons: "Any", "3+", "4+", "5"

### 4. Filter state management

In `PoopMap.tsx`, add filter state:

```typescript
interface MapFilters {
  dateFrom: string | null;
  dateTo: string | null;
  bristolTypes: number[];     // empty = all
  friendIds: string[];        // empty = all
  minRating: number | null;
}

const [filters, setFilters] = useState<MapFilters>({
  dateFrom: null,
  dateTo: null,
  bristolTypes: [],
  friendIds: [],
  minRating: null,
});
```

### 5. Apply filters

Filter pins client-side before passing to `MapInner`:

```typescript
function applyFilters(pins: LocationPin[], filters: MapFilters): LocationPin[] {
  return pins.filter((pin) => {
    // Date range
    if (filters.dateFrom && pin.created_at < filters.dateFrom) return false;
    if (filters.dateTo && pin.created_at > filters.dateTo) return false;

    // Bristol type
    if (filters.bristolTypes.length > 0 && pin.bristol_type) {
      if (!filters.bristolTypes.includes(pin.bristol_type)) return false;
    }

    // Friend filter
    if (filters.friendIds.length > 0 && pin.user_id) {
      if (!filters.friendIds.includes(pin.user_id)) return false;
    }

    return true;
  });
}
```

### 6. UI layout

The filter panel sits above the map, collapsible:

```tsx
<div className="mb-4">
  <button
    onClick={() => setFiltersOpen(!filtersOpen)}
    className="flex items-center gap-2 text-sm font-medium text-text-secondary"
  >
    <Icon name="filter_list" />
    Filters
    {activeFilterCount > 0 && (
      <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
        {activeFilterCount}
      </span>
    )}
  </button>

  {filtersOpen && <MapFilters filters={filters} onChange={setFilters} friends={friendsList} />}
</div>
```

Show an active filter count badge when filters are applied.

### 7. "Clear Filters" button

When any filter is active, show a "Clear All" button that resets to defaults.

## Files Changed

| File | Change |
|------|--------|
| `src/app/(authenticated)/map/page.tsx` | Join `movement_logs` to get `bristol_type` |
| `src/components/map/MapFilters.tsx` | New: filter panel component |
| `src/components/map/PoopMap.tsx` | Add filter state, apply filters, toggle panel |
| `src/components/map/MapInner.tsx` | Accept filtered pins (no filter logic here) |

## Testing

- Filter by date range and verify only pins within range are shown
- Filter by Bristol type and verify correct pins show/hide
- Filter by specific friend and verify only their pins appear
- Combine multiple filters and verify they work together (AND logic)
- Clear filters and verify all pins reappear
- Verify filter count badge updates correctly
- Verify heatmap updates when filters change
