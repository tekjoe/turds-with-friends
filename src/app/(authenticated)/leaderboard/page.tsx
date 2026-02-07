import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LeaderboardClient } from "@/components/leaderboard/LeaderboardClient";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // --- Fetch all data in parallel ---
  const [
    { data: globalProfiles },
    { data: friendships },
    { data: pendingRaw },
    { data: userProfile },
  ] = await Promise.all([
    // Global leaderboard: top 20 profiles by XP
    admin
      .from("profiles")
      .select("id, display_name, username, avatar_url, xp_total, current_streak")
      .order("xp_total", { ascending: false })
      .limit(20),
    // Accepted friendships for the current user
    admin
      .from("friendships")
      .select("requester_id, addressee_id")
      .eq("status", "accepted")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`),
    // Pending friend requests where user is addressee
    admin
      .from("friendships")
      .select("id, created_at, requester_id")
      .eq("addressee_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    // Current user's profile
    supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, xp_total, current_streak")
      .eq("id", user.id)
      .single(),
  ]);

  // --- Global leaderboard ---
  const allGlobal = (globalProfiles ?? []).map((p, i) => ({
    id: p.id,
    rank: i + 1,
    name: p.display_name ?? p.username ?? "Anonymous",
    initials: getInitials(p.display_name ?? p.username ?? "Anonymous"),
    avatar: p.avatar_url ?? undefined,
    streak: p.current_streak,
    points: p.xp_total,
    isCurrentUser: p.id === user.id,
  }));

  const globalPodium = allGlobal.slice(0, 3).map((u) => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    streak: u.streak,
    points: u.points,
    rank: (u.rank as 1 | 2 | 3),
  }));

  const globalTable = allGlobal;

  // User's global rank
  const userGlobalRank = allGlobal.find((u) => u.isCurrentUser)?.rank ?? null;
  const userXp = userProfile?.xp_total ?? 0;

  // --- Friends leaderboard ---
  const friendIds = (friendships ?? []).map((f) =>
    f.requester_id === user.id ? f.addressee_id : f.requester_id
  );

  let friendsRanking: typeof allGlobal = [];

  if (friendIds.length > 0) {
    const { data: friendProfiles } = await admin
      .from("profiles")
      .select("id, display_name, username, avatar_url, xp_total, current_streak")
      .in("id", friendIds);

    const allFriends = [
      ...(friendProfiles ?? []),
      ...(userProfile ? [userProfile] : []),
    ]
      .sort((a, b) => b.xp_total - a.xp_total)
      .map((p, i) => ({
        id: p.id,
        rank: i + 1,
        name: p.display_name ?? p.username ?? "Anonymous",
        initials: getInitials(p.display_name ?? p.username ?? "Anonymous"),
        avatar: p.avatar_url ?? undefined,
        streak: p.current_streak,
        points: p.xp_total,
        isCurrentUser: p.id === user.id,
      }));

    friendsRanking = allFriends;
  } else if (userProfile) {
    friendsRanking = [
      {
        id: userProfile.id,
        rank: 1,
        name: userProfile.display_name ?? userProfile.username ?? "Anonymous",
        initials: getInitials(userProfile.display_name ?? userProfile.username ?? "Anonymous"),
        avatar: userProfile.avatar_url ?? undefined,
        streak: userProfile.current_streak,
        points: userProfile.xp_total,
        isCurrentUser: true,
      },
    ];
  }

  const friendsPodium = friendsRanking.slice(0, 3).map((u) => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    streak: u.streak,
    points: u.points,
    rank: (u.rank as 1 | 2 | 3),
  }));

  const friendsTable = friendsRanking;

  // --- Pending invites ---
  let pendingInvites: Array<{
    id: string;
    name: string;
    initials: string;
    avatar?: string;
    timeAgo: string;
  }> = [];

  if (pendingRaw && pendingRaw.length > 0) {
    const requesterIds = pendingRaw.map((r) => r.requester_id);
    const { data: requesterProfiles } = await admin
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", requesterIds);

    const profileMap = new Map(
      (requesterProfiles ?? []).map((p) => [p.id, p])
    );

    pendingInvites = pendingRaw.map((r) => {
      const p = profileMap.get(r.requester_id);
      const name = p?.display_name ?? p?.username ?? "Someone";
      return {
        id: r.id,
        name,
        initials: getInitials(name),
        avatar: p?.avatar_url ?? undefined,
        timeAgo: timeAgo(r.created_at),
      };
    });
  }

  // --- Friends list ---
  const friendsListData: Array<{
    id: string;
    name: string;
    initials: string;
    avatar?: string;
    isOnline: boolean;
    status?: string;
    lastSeen?: string;
  }> = [];

  if (friendIds.length > 0) {
    const { data: friendProfiles } = await admin
      .from("profiles")
      .select("id, display_name, username, avatar_url, current_streak")
      .in("id", friendIds);

    (friendProfiles ?? []).forEach((fp) => {
      const name = fp.display_name ?? fp.username ?? "Anonymous";
      const hasStreak = fp.current_streak > 0;
      friendsListData.push({
        id: fp.id,
        name,
        initials: getInitials(name),
        avatar: fp.avatar_url ?? undefined,
        isOnline: hasStreak,
        status: hasStreak ? `${fp.current_streak} Day Streak` : undefined,
        lastSeen: hasStreak ? undefined : "Inactive",
      });
    });
  }

  // Total user count for global rank display
  const { count: totalUsers } = await admin
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <LeaderboardClient
      globalPodium={globalPodium}
      globalTable={globalTable}
      friendsPodium={friendsPodium}
      friendsTable={friendsTable}
      pendingInvites={pendingInvites}
      friendsList={friendsListData}
      userGlobalRank={userGlobalRank}
      userXp={userXp}
      totalUsers={totalUsers ?? 0}
    />
  );
}
