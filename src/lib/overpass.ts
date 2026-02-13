export interface PublicBathroom {
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
  const query = `[out:json][timeout:10];node["amenity"="toilets"](around:${radiusMeters},${lat},${lng});out body;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: `data=${encodeURIComponent(query)}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Overpass API error: ${res.status}`);
  }

  const data = await res.json();

  return (data.elements ?? []).map((el: Record<string, unknown>) => ({
    id: el.id as number,
    lat: el.lat as number,
    lon: el.lon as number,
    name: (el.tags as Record<string, string> | undefined)?.name,
    wheelchair: (el.tags as Record<string, string> | undefined)?.wheelchair,
    fee: (el.tags as Record<string, string> | undefined)?.fee,
    openingHours: (el.tags as Record<string, string> | undefined)
      ?.opening_hours,
    operator: (el.tags as Record<string, string> | undefined)?.operator,
  }));
}
