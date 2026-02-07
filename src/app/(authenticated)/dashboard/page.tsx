import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthNavbar } from "@/components/ui/AuthNavbar";
import { StatsCard } from "@/components/ui/StatsCard";
import { WeightChart } from "@/components/charts/WeightChart";
import { ConsistencyChart } from "@/components/charts/ConsistencyChart";
import { FriendRanking } from "@/components/dashboard/FriendRanking";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { BristolReference } from "@/components/dashboard/BristolReference";

// Sample data for demonstration
const sampleWeightData = [
  { day: "Mon", weight: 0.4 },
  { day: "Tue", weight: 0.6 },
  { day: "Wed", weight: 0.3 },
  { day: "Thu", weight: 0.8 },
  { day: "Fri", weight: 0.5 },
  { day: "Sat", weight: 0.2 },
  { day: "Sun", weight: 0.6 },
];

const sampleConsistencyData = [
  { name: "Type 1 & 2 (Constipated)", value: 15, color: "#78350f" },
  { name: "Type 3 & 4 (Ideal)", value: 70, color: "#059669" },
  { name: "Type 5 (Fiber Lacking)", value: 10, color: "#d97706" },
  { name: "Type 6 & 7 (Liquid/Inflam)", value: 5, color: "#e11d48" },
];

const sampleFriends = [
  { id: "1", rank: 1, name: "Johnny Deuce", initials: "JD", points: "2.4k pts", color: "#facc15" },
  { id: "2", rank: 2, name: "Bowl Patrol", initials: "BP", points: "1.9k pts", color: "#cbd5e1" },
  { id: "3", rank: 3, name: "Shatner", initials: "SH", points: "1.8k pts", color: "#fdba74" },
  { id: "4", rank: 4, name: "Flush G.", initials: "FG", points: "1.6k pts", color: "#92400E", isCurrentUser: true },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

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
  const displayName = profile?.display_name ?? user.email?.split("@")[0] ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const level = Math.floor(xpTotal / 500) + 1;

  // Fetch recent logs for weight data
  const { data: recentLogs } = await supabase
    .from("movement_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(7);

  // Calculate average Bristol type
  const avgBristolType = recentLogs && recentLogs.length > 0
    ? Math.round(recentLogs.reduce((sum, log) => sum + log.bristol_type, 0) / recentLogs.length)
    : 4;

  // Calculate total weight lost this week
  const weeklyWeightLost = recentLogs
    ?.filter(log => log.pre_weight && log.post_weight)
    .reduce((sum, log) => sum + ((log.pre_weight ?? 0) - (log.post_weight ?? 0)), 0)
    .toFixed(1) ?? "0.0";

  return (
    <div className="min-h-screen bg-background">
      <AuthNavbar
        userName={displayName}
        userLevel={`Level ${level} Stool Master`}
        userInitials={initials}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            value="#4 / 12 Friends"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            <WeightChart data={sampleWeightData} />
            <ConsistencyChart data={sampleConsistencyData} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <StreakCard currentStreak={currentStreak} personalBest={longestStreak} />
            <FriendRanking friends={sampleFriends} />
            <BristolReference />
          </div>
        </div>
      </main>
    </div>
  );
}
