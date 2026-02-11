import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Premium check disabled - all users have access
  // const premium = await isPremium(user.id);

  const { data, error } = await supabase
    .from("location_logs")
    .select("id, movement_log_id, latitude, longitude, place_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ locations: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Premium check disabled - all users have access
  // const premium = await isPremium(user.id);

  const body = await request.json();
  const { movement_log_id, latitude, longitude, place_name } = body as {
    movement_log_id: string;
    latitude: number;
    longitude: number;
    place_name?: string;
  };

  if (!movement_log_id || latitude == null || longitude == null) {
    return NextResponse.json(
      { error: "movement_log_id, latitude, and longitude are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("location_logs").insert({
    movement_log_id,
    user_id: user.id,
    latitude,
    longitude,
    place_name: place_name ?? null,
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ location: data });
}
