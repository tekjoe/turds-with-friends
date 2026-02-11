import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isPremium } from "@/lib/premium";
import { StatsCard } from "@/components/ui/StatsCard";
import { WeightChart } from "@/components/charts/WeightChart";
import { ConsistencyChart } from "@/components/charts/ConsistencyChart";
import { FriendRanking } from "@/components/dashboard/FriendRanking";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { BristolReference } from "@/components/dashboard/BristolReference";
import { ExportButton } from "@/components/dashboard/ExportButton";

const RANK_COLORS = ["#facc15", "#cbd5e1", "#fdba74", "#a78bfa", "#67e8f9", "#f9a8d4"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatPoints(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k pts`;
  return `${xp} pts`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  void isPremium(user.id); // Kept for future reference when premium features are re-enabled

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Calculate stats
  const currentStreak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;
  const xpTotal = profile?.xp_total ?? 0;
  const displayName = profile?.display_name ?? profile?.username ?? user.email?.split("@")[0] ?? "User";

  // Fetch recent logs for weight chart (last 7)
  const { data: recentLogs } = await supabase
    .from("movement_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(7);

  // Fetch more logs for consistency chart (last 30)
  const { data: allLogs } = await supabase
    .from("movement_logs")
    .select("bristol_type")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(30);

  // Calculate average Bristol type
  const avgBristolType = recentLogs && recentLogs.length > 0
    ? Math.round(recentLogs.reduce((sum, log) => sum + log.bristol_type, 0) / recentLogs.length)
    : 4;

  // Calculate total weight lost this week
  const weeklyWeightLost = recentLogs
    ?.filter(log => log.pre_weight && log.post_weight)
    .reduce((sum, log) => sum + ((log.pre_weight ?? 0) - (log.post_weight ?? 0)), 0)
    .toFixed(1) ?? "0.0";

  // --- Weight chart data ---
  const weightData = (recentLogs ?? [])
    .filter((log) => log.pre_weight && log.post_weight)
    .map((log) => ({
      day: DAY_NAMES[new Date(log.logged_at).getDay()],
      weight: Math.max(0, (log.pre_weight ?? 0) - (log.post_weight ?? 0)),
    }))
    .reverse();

  // --- Consistency chart data ---
  const logsList = allLogs ?? [];
  const total = logsList.length;
  let constipated = 0;
  let ideal = 0;
  let fiberLacking = 0;
  let liquid = 0;

  logsList.forEach((log) => {
    const t = log.bristol_type;
    if (t <= 2) constipated++;
    else if (t <= 4) ideal++;
    else if (t === 5) fiberLacking++;
    else liquid++;
  });

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
  const consistencyData = [
    { name: "Type 1 & 2 (Constipated)", value: pct(constipated), color: "#78350f" },
    { name: "Type 3 & 4 (Ideal)", value: pct(ideal), color: "#059669" },
    { name: "Type 5 (Fiber Lacking)", value: pct(fiberLacking), color: "#d97706" },
    { name: "Type 6 & 7 (Liquid/Inflam)", value: pct(liquid), color: "#e11d48" },
  ];

  // --- Friend ranking data ---
  const { data: friendships } = await admin
    .from("friendships")
    .select("requester_id, addressee_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

  const friendIds = (friendships ?? []).map((f) =>
    f.requester_id === user.id ? f.addressee_id : f.requester_id
  );

  const rankingList: Array<{
    id: string;
    name: string;
    initials: string;
    avatarUrl: string | null;
    xp: number;
    isCurrentUser: boolean;
  }> = [
    {
      id: user.id,
      name: displayName,
      initials: getInitials(displayName),
      avatarUrl: profile?.avatar_url ?? null,
      xp: xpTotal,
      isCurrentUser: true,
    },
  ];

  if (friendIds.length > 0) {
    const { data: friendProfiles } = await admin
      .from("profiles")
      .select("id, display_name, username, avatar_url, xp_total")
      .in("id", friendIds);

    (friendProfiles ?? []).forEach((fp) => {
      const name = fp.display_name ?? fp.username ?? "Anonymous";
      rankingList.push({
        id: fp.id,
        name,
        initials: getInitials(name),
        avatarUrl: fp.avatar_url,
        xp: fp.xp_total,
        isCurrentUser: false,
      });
    });
  }

  rankingList.sort((a, b) => b.xp - a.xp);

  const friendRankingData = rankingList.map((entry, i) => ({
    id: entry.id,
    rank: i + 1,
    name: entry.name,
    initials: entry.initials,
    avatarUrl: entry.avatarUrl,
    points: formatPoints(entry.xp),
    color: entry.isCurrentUser ? "#92400E" : RANK_COLORS[i % RANK_COLORS.length],
    isCurrentUser: entry.isCurrentUser,
  }));

  const userRank = friendRankingData.find((f) => f.isCurrentUser)?.rank ?? 1;
  const totalInRanking = friendRankingData.length;
  const rankLabel = `#${userRank} / ${totalInRanking} ${totalInRanking === 1 ? "User" : "Friends"}`;

  return (
    <div className="min-h-screen bg-background pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-end mb-6">
          <ExportButton />
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon="local_fire_department"
            iconColor="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            label="Current Streak"
            value={`${currentStreak} Days`}
          />
          <StatsCard
            icon="monitor_weight"
            iconColor="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            label="Weight Lost (7d)"
            value={`${weeklyWeightLost} lbs`}
          />
          <StatsCard
            icon="check_circle"
            iconColor="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            label="Avg Consistency"
            value={`Type ${avgBristolType}`}
          />
          <StatsCard
            icon="emoji_events"
            iconColor="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            label="Rank"
            value={rankLabel}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            <WeightChart data={weightData} />
            <ConsistencyChart data={consistencyData} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <StreakCard currentStreak={currentStreak} personalBest={longestStreak} />
            <FriendRanking friends={friendRankingData} />
            <BristolReference />
          </div>
        </div>
      </main>
    </div>
  );
}
