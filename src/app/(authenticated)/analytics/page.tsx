import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPremium } from "@/lib/premium";
import { MonthlyTrendsChart } from "@/components/analytics/MonthlyTrendsChart";
import { TimeOfDayChart } from "@/components/analytics/TimeOfDayChart";
import { BristolTrendsChart } from "@/components/analytics/BristolTrendsChart";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getTimeBucket(hour: number): string {
  if (hour >= 5 && hour <= 11) return "Morning";
  if (hour >= 12 && hour <= 16) return "Afternoon";
  if (hour >= 17 && hour <= 20) return "Evening";
  return "Night";
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const premium = await isPremium(user.id);
  if (!premium) redirect("/upgrade");

  const { data: logs } = await supabase
    .from("movement_logs")
    .select("bristol_type, logged_at")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: true });

  const allLogs = logs ?? [];

  // --- Monthly trends (last 12 months) ---
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const monthlyMap = new Map<string, number>();
  for (let i = 0; i < 12; i++) {
    const d = new Date(twelveMonthsAgo.getFullYear(), twelveMonthsAgo.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, 0);
  }

  allLogs.forEach((log) => {
    const d = new Date(log.logged_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyMap.has(key)) {
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1);
    }
  });

  const monthlyData = Array.from(monthlyMap.entries()).map(([key, count]) => ({
    month: MONTH_NAMES[parseInt(key.split("-")[1], 10) - 1],
    count,
  }));

  // --- Time of day ---
  const timeMap: Record<string, number> = {
    Morning: 0,
    Afternoon: 0,
    Evening: 0,
    Night: 0,
  };

  allLogs.forEach((log) => {
    const hour = new Date(log.logged_at).getHours();
    timeMap[getTimeBucket(hour)]++;
  });

  const timeData = ["Morning", "Afternoon", "Evening", "Night"].map((bucket) => ({
    bucket,
    count: timeMap[bucket],
  }));

  // --- Bristol type trends (stacked, last 12 months) ---
  const bristolMonthlyMap = new Map<
    string,
    { constipated: number; ideal: number; fiberLacking: number; liquid: number }
  >();

  for (let i = 0; i < 12; i++) {
    const d = new Date(twelveMonthsAgo.getFullYear(), twelveMonthsAgo.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    bristolMonthlyMap.set(key, { constipated: 0, ideal: 0, fiberLacking: 0, liquid: 0 });
  }

  allLogs.forEach((log) => {
    const d = new Date(log.logged_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entry = bristolMonthlyMap.get(key);
    if (!entry) return;
    const t = log.bristol_type;
    if (t <= 2) entry.constipated++;
    else if (t <= 4) entry.ideal++;
    else if (t === 5) entry.fiberLacking++;
    else entry.liquid++;
  });

  const bristolData = Array.from(bristolMonthlyMap.entries()).map(([key, counts]) => ({
    month: MONTH_NAMES[parseInt(key.split("-")[1], 10) - 1],
    ...counts,
  }));

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold font-display tracking-tight">
            Advanced Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Deep dive into your digestive patterns and trends.
          </p>
        </header>
        <div className="space-y-8">
          <MonthlyTrendsChart data={monthlyData} />
          <TimeOfDayChart data={timeData} />
          <BristolTrendsChart data={bristolData} />
        </div>
      </div>
    </div>
  );
}
