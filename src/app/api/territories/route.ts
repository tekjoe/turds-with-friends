import { createClient, createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { polygonToCells } from "h3-js";
import { h3ToPolygon, H3_RESOLUTION } from "@/lib/h3";

const MAX_CELLS = 2000;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const boundsParam = request.nextUrl.searchParams.get("bounds");
  if (!boundsParam) {
    return NextResponse.json(
      { error: "bounds parameter is required (south,west,north,east)" },
      { status: 400 }
    );
  }

  const parts = boundsParam.split(",").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) {
    return NextResponse.json(
      { error: "bounds must be 4 comma-separated numbers: south,west,north,east" },
      { status: 400 }
    );
  }

  const [south, west, north, east] = parts;

  // Convert bounding box to polygon vertices (counter-clockwise)
  const boundsPolygon: [number, number][] = [
    [south, west],
    [north, west],
    [north, east],
    [south, east],
    [south, west],
  ];

  let h3Cells: string[];
  try {
    h3Cells = polygonToCells(boundsPolygon, H3_RESOLUTION);
  } catch {
    return NextResponse.json(
      { error: "Failed to compute H3 cells for the given bounds" },
      { status: 400 }
    );
  }

  if (h3Cells.length > MAX_CELLS) {
    return NextResponse.json(
      {
        error: `Too many cells (${h3Cells.length}). Zoom in to load territories.`,
        cellCount: h3Cells.length,
        maxCells: MAX_CELLS,
      },
      { status: 422 }
    );
  }

  if (h3Cells.length === 0) {
    return NextResponse.json({ territories: [], currentUserId: user.id });
  }

  // Use admin client to read all territory claims regardless of RLS
  const admin = createAdminClient();

  const { data: claims, error } = await admin
    .from("territory_claims")
    .select("h3_index, user_id, log_count")
    .in("h3_index", h3Cells);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!claims || claims.length === 0) {
    return NextResponse.json({ territories: [], currentUserId: user.id });
  }

  // Group by hex, find owner (highest log_count)
  const hexMap = new Map<
    string,
    { ownerId: string; ownerLogCount: number; totalLogs: number }
  >();

  for (const claim of claims) {
    const existing = hexMap.get(claim.h3_index);
    if (!existing) {
      hexMap.set(claim.h3_index, {
        ownerId: claim.user_id,
        ownerLogCount: claim.log_count,
        totalLogs: claim.log_count,
      });
    } else {
      existing.totalLogs += claim.log_count;
      if (claim.log_count > existing.ownerLogCount) {
        existing.ownerId = claim.user_id;
        existing.ownerLogCount = claim.log_count;
      }
    }
  }

  // Collect unique owner IDs for display name resolution
  const ownerIds = [...new Set([...hexMap.values()].map((v) => v.ownerId))];

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, display_name, username")
    .in("id", ownerIds);

  const nameMap = new Map<string, string>();
  for (const p of profiles ?? []) {
    nameMap.set(p.id, p.display_name || p.username || "Anonymous");
  }

  // Build response with pre-computed polygon boundaries
  const territories = [...hexMap.entries()].map(([h3Index, info]) => ({
    h3Index,
    boundary: h3ToPolygon(h3Index),
    ownerId: info.ownerId,
    ownerName: nameMap.get(info.ownerId) ?? "Anonymous",
    ownerLogCount: info.ownerLogCount,
    totalLogs: info.totalLogs,
  }));

  return NextResponse.json({ territories, currentUserId: user.id });
}
