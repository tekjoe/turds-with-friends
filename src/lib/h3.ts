import { latLngToCell, cellToBoundary } from "h3-js";

/** Resolution 8 ≈ 460m edge length — neighborhood-sized hexagons */
export const H3_RESOLUTION = 8;

/** Don't render territory hexes when zoomed out past this level */
export const TERRITORY_MIN_ZOOM = 12;

/** Color used for the current user's territories */
export const CURRENT_USER_COLOR = "#C05621";

/** Convert lat/lng to an H3 cell index at our resolution */
export function coordToH3(lat: number, lng: number): string {
  return latLngToCell(lat, lng, H3_RESOLUTION);
}

/** Convert an H3 index to a polygon boundary as [lat, lng][] for Leaflet */
export function h3ToPolygon(h3Index: string): [number, number][] {
  return cellToBoundary(h3Index) as [number, number][];
}

/** Deterministic HSL color from a user ID string */
export function userIdToColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  const hue = ((hash % 360) + 360) % 360;
  return `hsl(${hue}, 65%, 45%)`;
}
