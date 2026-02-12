import { createAdminClient, createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/landing/Hero";
import { BristolChart } from "@/components/bristol-scale/BristolChart";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";

// WebPage structured data (JSON-LD)
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Poop Tracker App | Track Your Gut Health | Bowel Buddies",
  description: "Track your bowel movements with the best poop tracker app. Monitor gut health using the Bristol Chart, analyze stool types, and compete with friends today!",
  url: "https://bowelbuddies.app",
  isPartOf: {
    "@type": "WebSite",
    name: "Bowel Buddies",
    url: "https://bowelbuddies.app",
  },
};

function formatStreak(streak: number): string {
  if (streak >= 7) return `${streak} Day Streak 🔥`;
  if (streak >= 3) return `${streak} Day Streak ⚡`;
  return `${streak} Day Streak`;
}

export default async function Home() {
  const supabase = createAdminClient();
  const userClient = await createClient();
  const { data: { user } } = await userClient.auth.getUser();

  const [{ count }, { data: topUsers }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("username, display_name, xp_total, current_streak, avatar_url, privacy_settings")
      .order("xp_total", { ascending: false })
      .limit(10),
  ]);

  const users = (topUsers ?? [])
    .filter((u) => {
      const settings = u.privacy_settings as Record<string, unknown> | null;
      return settings?.show_on_leaderboard !== false;
    })
    .slice(0, 3);

  const leaderboard = users.map((user, i) => ({
    rank: i + 1,
    name: user.username ?? user.display_name ?? "Anonymous",
    badge: formatStreak(user.current_streak),
    points: user.xp_total.toLocaleString(),
    avatarUrl: user.avatar_url,
  }));

  const avatars = users.map((user) => user.avatar_url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <div className="min-h-screen w-full text-slate-800 dark:text-slate-200">
        <main className="w-full">
          <Hero userCount={count ?? 0} leaderboard={leaderboard} avatars={avatars} isAuthenticated={!!user} />
          <BristolChart />
          <Features />
        </main>
        <Footer />
      </div>
    </>
  );
}
