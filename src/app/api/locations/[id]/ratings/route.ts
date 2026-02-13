import { createClient, createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: ratings } = await admin
    .from("location_ratings")
    .select("rating, user_id")
    .eq("location_log_id", id);

  const all = ratings ?? [];
  const count = all.length;
  const average = count > 0 ? all.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  const userRow = all.find((r) => r.user_id === user.id);

  return NextResponse.json({
    average: Math.round(average * 10) / 10,
    count,
    userRating: userRow?.rating ?? null,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { rating } = body as { rating: number };

  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json(
      { error: "rating must be an integer between 1 and 5" },
      { status: 400 }
    );
  }

  // Upsert the user's rating
  const { error } = await supabase
    .from("location_ratings")
    .upsert(
      {
        location_log_id: id,
        user_id: user.id,
        rating,
      },
      { onConflict: "location_log_id,user_id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return updated aggregates
  const admin = createAdminClient();
  const { data: ratings } = await admin
    .from("location_ratings")
    .select("rating, user_id")
    .eq("location_log_id", id);

  const all = ratings ?? [];
  const count = all.length;
  const average = count > 0 ? all.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return NextResponse.json({
    average: Math.round(average * 10) / 10,
    count,
    userRating: rating,
  });
}
