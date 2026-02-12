# 06 — Nearby Bathroom Finder

## Overview

Show public bathrooms near the user's current location on the map using OpenStreetMap data. Users can see bathroom locations, get basic info, and navigate to them.

## Effort

High — requires external API integration, new UI components, geolocation, and map layer management.

## Data Source

**OpenStreetMap Overpass API** — Free, no API key required, 574K+ toilet locations globally. Query for `amenity=toilets` nodes near a bounding box.

Alternative: If Overpass is too slow, cache results in Supabase or use a static dataset.

## Implementation Steps

### 1. Create Overpass query helper: `src/lib/overpass.ts`

```typescript
interface PublicBathroom {
  id: number;
  lat: number;
  lon: number;
  name?: string;
  wheelchair?: string;
  fee?: string;
  openingHours?: string;
  operator?: string;
}

export async function fetchNearbyBathrooms(
  lat: number,
  lng: number,
  radiusMeters: number = 2000
): Promise<PublicBathroom[]> {
  const query = `
    [out:json][timeout:10];
    node["amenity"="toilets"](around:${radiusMeters},${lat},${lng});
    out body;
  `;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: `data=${encodeURIComponent(query)}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const data = await res.json();

  return data.elements.map((el: any) => ({
    id: el.id,
    lat: el.lat,
    lon: el.lon,
    name: el.tags?.name,
    wheelchair: el.tags?.wheelchair,
    fee: el.tags?.fee,
    openingHours: el.tags?.opening_hours,
    operator: el.tags?.operator,
  }));
}
```

### 2. API route (optional caching): `src/app/api/locations/nearby-bathrooms/route.ts`

To avoid rate-limiting Overpass and improve performance:

```typescript
// GET /api/locations/nearby-bathrooms?lat=40.71&lng=-74.00&radius=2000
```

1. Authenticate the user
2. Round lat/lng to 2 decimal places for cache key
3. Check Supabase for cached results (optional `bathroom_cache` table with TTL)
4. If not cached, call Overpass API
5. Cache results for 24 hours
6. Return bathroom list

If caching is skipped initially, the client can call Overpass directly.

### 3. Update `MapInner.tsx` — Add bathroom layer

- Add a new state: `showBathrooms: boolean` (default false)
- When enabled, use the map's current center to fetch nearby bathrooms
- Render bathroom pins with a distinct icon (toilet/restroom icon, blue or purple color)
- Re-fetch when the map is panned significantly (debounce on `moveend` event)
- Bathroom markers should use a different `Marker` icon to distinguish from poop pins

Custom bathroom icon:
```typescript
const bathroomIcon = new L.DivIcon({
  html: `<div class="bathroom-pin"><span class="material-symbols-rounded">wc</span></div>`,
  className: "",
  iconSize: [32, 32],
});
```

### 4. Bathroom popup content

Each bathroom pin popup shows:
- Name (or "Public Restroom" if unnamed)
- Wheelchair accessible: yes/no/unknown
- Fee: free/paid/unknown
- Opening hours (if available)
- "Get Directions" link → opens Google Maps/Apple Maps with the coordinates

```typescript
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
```

### 5. Toggle in `PoopMap.tsx` options panel

Add a "Show Nearby Bathrooms" toggle alongside the existing "Show Friends" and "Show Heatmap" toggles:

```tsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    checked={showBathrooms}
    onChange={() => setShowBathrooms(!showBathrooms)}
  />
  <Icon name="wc" />
  <span>Nearby Bathrooms</span>
</label>
```

### 6. Geolocation

The bathroom finder needs the user's current location (or map center):
- Use `navigator.geolocation.getCurrentPosition()` to center the map on the user
- Add a "My Location" button (crosshair icon) that centers the map on the user's position
- Use the map's current center as the search center when the user pans

## Files Changed

| File | Change |
|------|--------|
| `src/lib/overpass.ts` | New helper for Overpass API queries |
| `src/app/api/locations/nearby-bathrooms/route.ts` | New API route (optional, for caching) |
| `src/components/map/MapInner.tsx` | Add bathroom markers layer, re-fetch on pan |
| `src/components/map/PoopMap.tsx` | Add "Show Nearby Bathrooms" toggle |
| `src/app/globals.css` | Add `.bathroom-pin` styles |

## Performance Considerations

- Debounce Overpass requests (300ms after map stops moving)
- Limit radius to 2-5km to keep result count manageable
- Consider client-side caching with `useSWR` or `useState` to avoid re-fetching on minor pans
- Overpass API rate limit: ~2 requests/second per IP. Caching server-side is recommended for production.

## Testing

- Toggle "Nearby Bathrooms" on and verify bathroom pins appear
- Pan map and verify new bathrooms load in the new area
- Click a bathroom pin and verify popup shows name, accessibility, fee, directions link
- Click "Get Directions" and verify it opens Google Maps
- Toggle off and verify bathroom pins disappear
- Test in an area with no public bathrooms — no errors, just no pins
