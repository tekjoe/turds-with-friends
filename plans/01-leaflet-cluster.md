# 01 — Leaflet Pin Clustering

## Overview

Group nearby map pins at lower zoom levels using marker clustering. Prevents the map from becoming unusable as pin count grows.

## Effort

Low — frontend-only, no database or API changes.

## Dependencies

- `react-leaflet-cluster` (npm package wrapping Leaflet.markercluster)

## Implementation Steps

### 1. Install dependency

```bash
npm install react-leaflet-cluster
```

### 2. Update `src/components/map/MapInner.tsx`

- Import `MarkerClusterGroup` from `react-leaflet-cluster`
- Wrap all `<Marker>` components (both user pins and friend pins) inside a `<MarkerClusterGroup>` component
- Configure cluster options:
  - `chunkedLoading={true}` — prevents UI freeze on large datasets
  - `maxClusterRadius={50}` — cluster radius in pixels
  - `spiderfyOnMaxZoom={true}` — spread pins at max zoom
  - `showCoverageOnHover={false}` — cleaner UX
- Add custom cluster icon styling to match the app theme (primary color background, white text showing pin count)

### 3. Cluster icon styling

Create a custom `createClusterCustomIcon` function:

```tsx
import { DivIcon } from "leaflet";

function createClusterCustomIcon(cluster: L.MarkerCluster) {
  const count = cluster.getChildCount();
  return new DivIcon({
    html: `<span>${count}</span>`,
    className: "custom-cluster-icon",
    iconSize: [36, 36],
  });
}
```

Add CSS in `globals.css`:

```css
.custom-cluster-icon {
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(192, 86, 33, 0.3);
}
```

### 4. Heatmap interaction

When heatmap mode is active, clustering should be disabled (heatmap replaces individual pins). The current `showHeatmap` state already controls whether markers are rendered, so no extra logic needed.

## Files Changed

| File | Change |
|------|--------|
| `package.json` | Add `react-leaflet-cluster` dependency |
| `src/components/map/MapInner.tsx` | Wrap markers in `MarkerClusterGroup`, add custom icon |
| `src/app/globals.css` | Add `.custom-cluster-icon` styles |

## Testing

- Load map with 50+ pins and verify clusters form at low zoom
- Zoom in and verify clusters split into individual pins
- Click a cluster to zoom into its children
- Verify heatmap mode still works independently
- Verify pin popups still open correctly when clicking individual pins
