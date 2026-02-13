# 11 — Rich Pin Cards

## Overview

Replace basic Leaflet popups with rich, detailed cards that show full location info: Bristol type, weight data, rating, comments preview, and action buttons. On mobile, use a slide-up bottom sheet; on desktop, use a side panel.

## Effort

Medium — new components, responsive behavior, data enrichment.

## Implementation Steps

### 1. Enrich pin data

In `src/app/(authenticated)/map/page.tsx`, join additional data when fetching location logs:

```typescript
const { data: myLocations } = await supabase
  .from("location_logs")
  .select(`
    id, latitude, longitude, place_name, created_at,
    movement_logs (
      bristol_type, logged_at, pre_weight, post_weight, weight_unit, xp_earned
    )
  `)
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });
```

Also fetch comment counts per location:

```typescript
// Count comments per location log
const locationIds = myLocations.map((l) => l.id);
const { data: commentCounts } = await admin
  .from("location_comments")
  .select("location_log_id")
  .in("location_log_id", locationIds.length > 0 ? locationIds : ["__none__"]);

const commentCountMap = new Map<string, number>();
(commentCounts ?? []).forEach((c) => {
  commentCountMap.set(c.location_log_id, (commentCountMap.get(c.location_log_id) ?? 0) + 1);
});
```

### 2. Update pin data interface

```typescript
interface EnrichedLocationPin {
  id: string;
  latitude: number;
  longitude: number;
  place_name: string | null;
  created_at: string;
  bristol_type: number | null;
  logged_at: string | null;
  pre_weight: number | null;
  post_weight: number | null;
  weight_unit: string;
  xp_earned: number;
  comment_count: number;
  // For friend pins:
  user_id?: string;
  user_name?: string;
  avatar_url?: string;
}
```

### 3. Create `src/components/map/PinDetailCard.tsx`

The detailed card component shown when a pin is selected:

```typescript
interface PinDetailCardProps {
  pin: EnrichedLocationPin;
  onClose: () => void;
  isFriendPin?: boolean;
}
```

**Card layout:**

```
┌─────────────────────────────────────────┐
│  ✕                                      │
│                                          │
│  📍 Starbucks on 5th Ave                │
│  2 days ago                              │
│                                          │
│  ┌──────────┐  ┌──────────┐             │
│  │ Bristol   │  │ Weight   │             │
│  │ Type 4    │  │ -0.4 lbs │             │
│  │ Smooth    │  │          │             │
│  └──────────┘  └──────────┘             │
│                                          │
│  ⭐⭐⭐⭐☆  4.2 (12)                   │
│                                          │
│  XP Earned: +75                          │
│                                          │
│  ─────────────────────────               │
│  💬 Comments (3)                         │
│  "Nice bathroom!" - Jake, 1h ago         │
│  "Agreed!" - Sarah, 30m ago              │
│  [View all comments]                     │
│                                          │
│  ┌────────────┐ ┌────────────┐          │
│  │ 💬 Comment │ │ 🔔 Nudge   │          │
│  └────────────┘ └────────────┘          │
└─────────────────────────────────────────┘
```

**Sections:**
1. **Header**: Place name, relative time, close button
2. **Stats grid**: Bristol type (colored badge), weight change (if available)
3. **Rating**: Star display (if ratings feature exists)
4. **XP earned**: Small badge
5. **Comments preview**: Show last 2-3 comments with "View all" link
6. **Actions**: Comment button, Nudge button (for friend pins), Rate button

### 4. Responsive behavior

**Desktop (md+)**:
- Side panel on the right side of the map
- Width: 360px
- Map shifts left to accommodate the panel
- Animate in/out with a slide transition

```tsx
<div className="flex h-full">
  <div className={`flex-1 transition-all ${selectedPin ? "mr-[360px]" : ""}`}>
    <MapInner ... />
  </div>
  {selectedPin && (
    <div className="absolute right-0 top-0 bottom-0 w-[360px] bg-card border-l border-card-border overflow-y-auto z-20">
      <PinDetailCard pin={selectedPin} onClose={() => setSelectedPin(null)} />
    </div>
  )}
</div>
```

**Mobile (< md)**:
- Bottom sheet that slides up from the bottom
- Height: 60% of viewport, draggable
- Backdrop overlay on the map

```tsx
<div className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-card rounded-t-2xl border-t border-card-border shadow-2xl max-h-[60vh] overflow-y-auto">
  <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-3 mb-2" /> {/* drag handle */}
  <PinDetailCard pin={selectedPin} onClose={() => setSelectedPin(null)} />
</div>
```

### 5. Replace Leaflet popups with card trigger

In `MapInner.tsx`, instead of rendering `<Popup>` inside markers, use click events to set the selected pin:

```tsx
<Marker
  position={[pin.latitude, pin.longitude]}
  icon={myIcon}
  eventHandlers={{
    click: () => onPinSelect(pin),
  }}
/>
```

Remove `<Popup>` components from markers (or keep a minimal tooltip on hover).

### 6. Comments inline loading

The `PinDetailCard` should lazy-load comments:
- Show comment count immediately (from pre-fetched data)
- On expand or "View all", fetch comments from `/api/locations/[id]/comments`
- Reuse the existing `LocationComments` component or extract its logic

### 7. Animation

Use CSS transitions for the panel:

```css
.pin-card-enter {
  transform: translateX(100%);
}
.pin-card-enter-active {
  transform: translateX(0);
  transition: transform 200ms ease-out;
}
```

Or use Tailwind's `animate-` classes.

## Files Changed

| File | Change |
|------|--------|
| `src/app/(authenticated)/map/page.tsx` | Enrich pin data with movement_logs join and comment counts |
| `src/components/map/PinDetailCard.tsx` | New: rich detail card |
| `src/components/map/MapInner.tsx` | Replace popups with click-to-select, emit `onPinSelect` |
| `src/components/map/PoopMap.tsx` | Manage selectedPin state, render PinDetailCard |

## Testing

- Click a pin → verify the detail card opens with correct data
- Verify Bristol type, weight, XP, and comments display correctly
- Close the card and verify it dismisses
- Test on mobile — verify bottom sheet behavior
- Test on desktop — verify side panel behavior
- Click a different pin while card is open → verify card updates
- Verify comment loading works
- Test with pins that have no weight data or comments — graceful empty states
