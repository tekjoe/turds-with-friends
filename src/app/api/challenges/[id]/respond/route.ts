import { createClient, createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: challengeId } = await params;
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
  const { status } = body as { status: "accepted" | "declined" };

  if (!status || !["accepted", "declined"].includes(status)) {
    return NextResponse.json(
      { error: "status must be 'accepted' or 'declined'" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("challenge_participants")
    .update({ status })
    .eq("challenge_id", challengeId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ participant: data });
}
