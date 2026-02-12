import { createClient } from "@/lib/supabase/server";
import { fetchNearbyBathrooms } from "@/lib/overpass";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache (per worker instance)
const cache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const radius = parseInt(searchParams.get("radius") ?? "2000", 10);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "lat and lng query parameters are required" },
      { status: 400 }
    );
  }

  // Round to 2 decimal places for cache key (~1km precision)
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)},${radius}`;
  const cached = cache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ bathrooms: cached.data });
  }

  try {
    const bathrooms = await fetchNearbyBathrooms(lat, lng, radius);
    cache.set(cacheKey, { data: bathrooms, expiresAt: Date.now() + CACHE_TTL_MS });
    return NextResponse.json({ bathrooms });
  } catch (err) {
    console.error("Overpass API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch nearby bathrooms" },
      { status: 502 }
    );
  }
}
