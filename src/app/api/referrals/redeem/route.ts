import { createClient, createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const REFERRAL_XP_REWARD = 100;

// POST /api/referrals/redeem - Redeem an invite code after signup
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { inviteCode } = body;

  if (!inviteCode || typeof inviteCode !== "string") {
    return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
  }

  const code = inviteCode.trim().toUpperCase();

  // Use admin client to bypass RLS for cross-user operations
  const admin = createAdminClient();

  // Find the referrer by invite code
  const { data: referrer } = await admin
    .from("profiles")
    .select("id, invite_code")
    .eq("invite_code", code)
    .single();

  if (!referrer) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  // Can't refer yourself
  if (referrer.id === user.id) {
    return NextResponse.json({ error: "Cannot use your own invite code" }, { status: 400 });
  }

  // Check if user already used a referral code
  const { data: existing } = await admin
    .from("referrals")
    .select("id")
    .eq("referred_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "You have already used a referral code" }, { status: 409 });
  }

  // Create the referral record
  const { error: insertError } = await admin
    .from("referrals")
    .insert({
      referrer_id: referrer.id,
      referred_id: user.id,
      invite_code: code,
      xp_awarded: true,
    });

  if (insertError) {
    return NextResponse.json({ error: "Failed to redeem referral" }, { status: 500 });
  }

  // Award XP to both users via direct increment
  const { data: referrerProfile } = await admin
    .from("profiles")
    .select("xp_total")
    .eq("id", referrer.id)
    .single();

  if (referrerProfile) {
    await admin
      .from("profiles")
      .update({ xp_total: referrerProfile.xp_total + REFERRAL_XP_REWARD })
      .eq("id", referrer.id);
  }

  const { data: referredProfile } = await admin
    .from("profiles")
    .select("xp_total")
    .eq("id", user.id)
    .single();

  if (referredProfile) {
    await admin
      .from("profiles")
      .update({ xp_total: referredProfile.xp_total + REFERRAL_XP_REWARD })
      .eq("id", user.id);
  }

  return NextResponse.json({
    success: true,
    xpAwarded: REFERRAL_XP_REWARD,
    message: `You and your friend both earned ${REFERRAL_XP_REWARD} XP!`,
  });
}
