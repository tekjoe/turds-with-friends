import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/referrals - Get user's invite code and referral stats
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get profile with invite code
  const { data: profile } = await supabase
    .from("profiles")
    .select("invite_code")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Get referral count
  const { count } = await supabase
    .from("referrals")
    .select("*", { count: "exact", head: true })
    .eq("referrer_id", user.id);

  return NextResponse.json({
    inviteCode: profile.invite_code,
    referralCount: count || 0,
  });
}
