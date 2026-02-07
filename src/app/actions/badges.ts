"use server";

import { createClient } from "@/lib/supabase/server";
import { checkBadgeEligibility } from "@/lib/gamification";

export async function checkAndAwardBadges(userId: string) {
  const supabase = await createClient();

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) {
    return { error: "Profile not found" };
  }

  // Get user's movement logs
  const { data: logs } = await supabase
    .from("movement_logs")
    .select("*")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false });

  if (!logs) {
    return { error: "Could not fetch logs" };
  }

  // Get all badges
  const { data: allBadges } = await supabase.from("badges").select("*");

  if (!allBadges) {
    return { error: "Could not fetch badges" };
  }

  // Get user's existing badges
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  const existingBadgeIds = new Set(userBadges?.map((ub) => ub.badge_id) ?? []);

  // Check each badge and award if eligible
  const newBadges = [];

  for (const badge of allBadges) {
    // Skip if user already has this badge
    if (existingBadgeIds.has(badge.id)) {
      continue;
    }

    // Check eligibility
    const isEligible = checkBadgeEligibility(profile, logs, badge);

    if (isEligible) {
      // Award the badge
      const { error } = await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badge.id,
      });

      if (!error) {
        newBadges.push(badge);
      }
    }
  }

  return { newBadges };
}

export async function getUserBadges(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_badges")
    .select(`
      id,
      earned_at,
      badges (
        id,
        name,
        description,
        icon_url
      )
    `)
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { badges: data };
}

export async function getLeaderboard(type: "global" | "friends" = "global", userId?: string) {
  const supabase = await createClient();

  if (type === "friends" && userId) {
    // Get friends first
    const { data: friendships } = await supabase
      .from("friendships")
      .select("requester_id, addressee_id")
      .eq("status", "accepted")
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

    if (!friendships || friendships.length === 0) {
      // Return just the user if no friends
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url, xp_total, current_streak")
        .eq("id", userId)
        .single();

      return { leaderboard: userProfile ? [userProfile] : [] };
    }

    // Get friend IDs
    const friendIds = new Set<string>();
    friendIds.add(userId); // Include current user
    friendships.forEach((f) => {
      if (f.requester_id === userId) {
        friendIds.add(f.addressee_id);
      } else {
        friendIds.add(f.requester_id);
      }
    });

    // Get friend profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, xp_total, current_streak")
      .in("id", Array.from(friendIds))
      .order("xp_total", { ascending: false })
      .limit(50);

    return { leaderboard: profiles ?? [] };
  }

  // Global leaderboard
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url, xp_total, current_streak")
    .order("xp_total", { ascending: false })
    .limit(50);

  return { leaderboard: profiles ?? [] };
}

export async function sendFriendRequest(addresseeId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check if friendship already exists
  const { data: existing } = await supabase
    .from("friendships")
    .select("id, status")
    .or(
      `and(requester_id.eq.${user.id},addressee_id.eq.${addresseeId}),and(requester_id.eq.${addresseeId},addressee_id.eq.${user.id})`
    )
    .single();

  if (existing) {
    if (existing.status === "accepted") {
      return { error: "Already friends" };
    }
    if (existing.status === "pending") {
      return { error: "Friend request already pending" };
    }
    if (existing.status === "blocked") {
      return { error: "Unable to send friend request" };
    }
  }

  // Send request
  const { error } = await supabase.from("friendships").insert({
    requester_id: user.id,
    addressee_id: addresseeId,
    status: "pending",
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function respondToFriendRequest(
  friendshipId: string,
  response: "accept" | "decline"
) {
  const supabase = await createClient();

  if (response === "decline") {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);

    if (error) {
      return { error: error.message };
    }
    return { success: true };
  }

  // Accept
  const { error } = await supabase
    .from("friendships")
    .update({ status: "accepted" })
    .eq("id", friendshipId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
