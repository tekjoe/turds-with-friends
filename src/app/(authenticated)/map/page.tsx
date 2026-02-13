import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isPremium } from "@/lib/premium";
import { PoopMap } from "@/components/map/PoopMap";
import type {
  EnrichedLocationPin,
  EnrichedFriendPin,
} from "@/components/map/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenMovementLog(loc: any): {
  bristol_type: number | null;
  logged_at: string | null;
  pre_weight: number | null;
  post_weight: number | null;
  weight_unit: string;
  xp_earned: number;
} {
  const logs = loc.movement_logs;
  const log = Array.isArray(logs) ? logs[0] : logs;
  return {
    bristol_type: log?.bristol_type ?? null,
    logged_at: log?.logged_at ?? null,
    pre_weight: log?.pre_weight ?? null,
    post_weight: log?.post_weight ?? null,
    weight_unit: log?.weight_unit ?? "lb",
    xp_earned: log?.xp_earned ?? 0,
  };
}

export default async function MapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const userAvatar =
    (user.user_metadata?.avatar_url as string | undefined) ?? null;

  // Premium check kept for future reference - redirects removed as part of US-001
  await isPremium(user.id);

  const admin = createAdminClient();

  // Fetch user's own locations + accepted friendships in parallel
  const [{ data: myLocations }, { data: friendships }] = await Promise.all([
    supabase
      .from("location_logs")
      .select(
        "id, latitude, longitude, place_name, created_at, movement_logs(bristol_type, logged_at, pre_weight, post_weight, weight_unit, xp_earned)"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    admin
      .from("friendships")
      .select("requester_id, addressee_id")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .eq("status", "accepted"),
  ]);

  // Flatten movement_logs into enriched pins
  const enrichedLocations: EnrichedLocationPin[] = (myLocations ?? []).map(
    (loc) => ({
      id: loc.id,
      latitude: loc.latitude,
      longitude: loc.longitude,
      place_name: loc.place_name,
      created_at: loc.created_at,
      ...flattenMovementLog(loc),
    })
  );

  // Get friend IDs
  const friendIds = (friendships ?? []).map((f) =>
    f.requester_id === user.id ? f.addressee_id : f.requester_id
  );

  let friendPins: EnrichedFriendPin[] = [];

  if (friendIds.length > 0) {
    // Fetch friend profiles to check privacy settings
    const { data: friendProfiles } = await admin
      .from("profiles")
      .select("id, username, display_name, avatar_url, privacy_settings")
      .in("id", friendIds);

    const sharingFriends = (friendProfiles ?? []).filter((p) => {
      const settings = p.privacy_settings as Record<string, unknown> | null;
      return settings?.share_poop_locations === true;
    });

    if (sharingFriends.length > 0) {
      const sharingIds = sharingFriends.map((f) => f.id);
      const { data: friendLocs } = await admin
        .from("location_logs")
        .select(
          "id, user_id, latitude, longitude, place_name, created_at, movement_logs(bristol_type, logged_at, pre_weight, post_weight, weight_unit, xp_earned)"
        )
        .in("user_id", sharingIds)
        .order("created_at", { ascending: false });

      const profileMap = new Map(
        sharingFriends.map((p) => [
          p.id,
          {
            name: p.username ?? p.display_name ?? "Friend",
            avatar: p.avatar_url,
          },
        ])
      );

      friendPins = (friendLocs ?? []).map((loc) => {
        const profile = profileMap.get(loc.user_id);
        return {
          id: loc.id,
          latitude: loc.latitude,
          longitude: loc.longitude,
          place_name: loc.place_name,
          created_at: loc.created_at,
          ...flattenMovementLog(loc),
          friendName: profile?.name ?? "Friend",
          friendAvatar: profile?.avatar ?? null,
          friendId: loc.user_id,
        };
      });
    }
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold font-display tracking-tight">
            Poop Map
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Every throne you've conquered, pinned on the map.
          </p>
        </header>
        <PoopMap
          locations={enrichedLocations}
          friendLocations={friendPins}
          userAvatar={userAvatar}
        />
      </div>
    </div>
  );
}
