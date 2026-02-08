import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isPremium } from "@/lib/premium";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: locationLogId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const premium = await isPremium(user.id);
  if (!premium) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  const admin = createAdminClient();

  const { data: comments, error } = await admin
    .from("location_comments")
    .select("id, user_id, body, created_at")
    .eq("location_log_id", locationLogId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Enrich with profile info
  const userIds = [...new Set((comments ?? []).map((c) => c.user_id))];
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", userIds.length > 0 ? userIds : ["__none__"]);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [
      p.id,
      {
        name: p.display_name ?? p.username ?? "Anonymous",
        avatar: p.avatar_url,
      },
    ])
  );

  const enriched = (comments ?? []).map((c) => {
    const profile = profileMap.get(c.user_id);
    return {
      ...c,
      userName: profile?.name ?? "Anonymous",
      avatarUrl: profile?.avatar ?? null,
    };
  });

  return NextResponse.json({ comments: enriched });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: locationLogId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const premium = await isPremium(user.id);
  if (!premium) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  const body = await request.json();
  const { body: commentBody } = body as { body: string };

  if (!commentBody?.trim()) {
    return NextResponse.json(
      { error: "Comment body is required" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Insert the comment
  const { data: comment, error } = await admin
    .from("location_comments")
    .insert({
      location_log_id: locationLogId,
      user_id: user.id,
      body: commentBody.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create notification for the location owner (if not self)
  const { data: locationLog } = await admin
    .from("location_logs")
    .select("user_id, place_name")
    .eq("id", locationLogId)
    .single();

  if (locationLog && locationLog.user_id !== user.id) {
    // Get commenter's name
    const { data: commenterProfile } = await admin
      .from("profiles")
      .select("display_name, username")
      .eq("id", user.id)
      .single();

    const commenterName =
      commenterProfile?.display_name ??
      commenterProfile?.username ??
      "Someone";

    const placeName = locationLog.place_name ?? "a location";

    await admin.from("notifications").insert({
      user_id: locationLog.user_id,
      actor_id: user.id,
      type: "comment",
      reference_id: locationLogId,
      message: `${commenterName} commented on your poop at ${placeName}`,
    });
  }

  return NextResponse.json({ comment });
}
