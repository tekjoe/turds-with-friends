# 10 — List View Toggle

## Overview

Add a toggle to switch between map view and a sortable table/list view of all locations. The list view shows location details at a glance and is easier to browse on mobile.

## Effort

Medium — new component, data is already available from the map page.

## Implementation Steps

### 1. Add view toggle state in `PoopMap.tsx`

```typescript
type MapView = "map" | "list";
const [view, setView] = useState<MapView>("map");
```

Add toggle buttons above the map/list:

```tsx
<div className="flex bg-muted rounded-lg p-1 w-fit">
  <button
    onClick={() => setView("map")}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      view === "map" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
    }`}
  >
    <Icon name="map" className="text-base mr-1.5" />
    Map
  </button>
  <button
    onClick={() => setView("list")}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
    }`}
  >
    <Icon name="format_list_bulleted" className="text-base mr-1.5" />
    List
  </button>
</div>
```

### 2. Create `src/components/map/LocationList.tsx`

Props:
```typescript
interface LocationListProps {
  locations: LocationPin[];
  friendLocations?: LocationPin[];
  onPinClick?: (id: string) => void; // switch to map and focus pin
}
```

**List item layout** (each row):

```
┌──────────────────────────────────────────────────────┐
│ 📍 Starbucks on 5th Ave          Type 4    ⭐ 4.2   │
│    2 days ago                     Smooth    12 ratings│
│    ─────────────────────────────────────              │
│    [View on Map]  [Comments (3)]                     │
└──────────────────────────────────────────────────────┘
```

Each row shows:
- Place name (or "Unknown Location")
- Time ago (relative)
- Bristol type with color badge
- Star rating (if ratings feature is implemented)
- Comment count
- "View on Map" button → switches to map view and focuses that pin

### 3. Sorting

Add sort controls at the top of the list:

```typescript
type SortField = "date" | "bristol" | "place" | "rating";
type SortDirection = "asc" | "desc";
```

Sort options:
- **Date** (default, newest first)
- **Bristol Type** (1-7)
- **Place Name** (A-Z)
- **Rating** (highest first, if ratings are available)

```tsx
<div className="flex items-center gap-2 mb-4">
  <span className="text-sm text-muted-foreground">Sort by:</span>
  <select
    value={sortField}
    onChange={(e) => setSortField(e.target.value as SortField)}
    className="text-sm bg-card border border-card-border rounded-lg px-3 py-1.5"
  >
    <option value="date">Date</option>
    <option value="bristol">Bristol Type</option>
    <option value="place">Place Name</option>
  </select>
  <button onClick={toggleDirection}>
    <Icon name={sortDir === "asc" ? "arrow_upward" : "arrow_downward"} />
  </button>
</div>
```

### 4. Friend locations in list

If "Show Friends" is toggled on, interleave friend locations in the list with a visual indicator (friend's avatar and name).

### 5. Empty state

If no locations match (after filtering), show:
```
No locations found. Start logging with location enabled to see your poop map!
```

### 6. "View on Map" interaction

When clicking "View on Map" on a list item:
1. Switch view to "map"
2. Set the focused pin ID (reuse existing `?pin=` URL parameter logic)
3. The map will center on that pin and open its popup

### 7. Conditional rendering

In `PoopMap.tsx`:
```tsx
{view === "map" ? (
  <MapInner ... />
) : (
  <LocationList
    locations={filteredMyLocations}
    friendLocations={showFriends ? filteredFriendLocations : []}
    onPinClick={(id) => { setView("map"); setFocusedPin(id); }}
  />
)}
```

## Files Changed

| File | Change |
|------|--------|
| `src/components/map/LocationList.tsx` | New: sortable list view |
| `src/components/map/PoopMap.tsx` | Add view toggle state, conditional render |

## Testing

- Toggle between map and list views
- Verify all locations appear in the list
- Sort by each field and verify order
- Click "View on Map" and verify map focuses on that pin
- Apply filters and verify list updates
- Verify friend locations appear when toggled on
- Test empty state with no locations
- Test on mobile — verify list items are touch-friendly
