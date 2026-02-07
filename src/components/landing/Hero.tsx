import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 w-full">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Column - Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
            <Icon name="verified_user" className="text-sm" />
            The #1 Rated Gut-Health Tracker
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold font-display leading-tight text-slate-900 dark:text-white">
            Track Your Health,{" "}
            <span className="text-primary italic">One Log</span> at a Time.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl">
            Gamify your bowel movements with the Bristol Stool Chart. Compete with
            friends, earn badges, and maintain a healthy gut together.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/login">
              <Button variant="primary" size="lg">
                <Icon name="add_circle" />
                Start Tracking
              </Button>
            </Link>
            <Link href="#chart">
              <Button variant="secondary" size="lg">
                How it Works
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700"
                />
              ))}
            </div>
            <div className="text-sm">
              <span className="font-bold text-slate-900 dark:text-white">12,000+</span>{" "}
              regular users <br />
              staying healthy this week.
            </div>
          </div>
        </div>

        {/* Right Column - Leaderboard Preview */}
        <div className="relative">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10"></div>

          <div className="bg-[#FFFFFF] dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-display flex items-center gap-2">
                  <Icon name="emoji_events" className="text-yellow-500" />
                  Weekly Leaderboard
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Global
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { rank: 1, name: "Oliver G.", badge: "7 Day Streak 🔥", points: "2,450" },
                  { rank: 2, name: "Sophie M.", badge: "Perfect Week 🥬", points: "2,120" },
                  { rank: 3, name: "You (Jackson)", badge: "Ranked up! 🚀", points: "1,980" },
                ].map((user, index) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-2xl ${
                      index === 0
                        ? "bg-slate-50 dark:bg-slate-800/50"
                        : "bg-[#FFFFFF] dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-bold w-4 ${
                          user.rank === 1 ? "text-primary" : "text-slate-400"
                        }`}
                      >
                        {user.rank}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.badge}</p>
                      </div>
                    </div>
                    <span
                      className={`font-display font-bold text-lg ${
                        user.rank === 1
                          ? "text-primary"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {user.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Icons */}
            <div className="flex justify-center gap-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="floating flex flex-col items-center" style={{ animationDelay: "0s" }}>
                <div className="text-4xl">💩</div>
                <span className="text-[10px] font-bold mt-1 text-slate-400">Regular</span>
              </div>
              <div className="floating flex flex-col items-center" style={{ animationDelay: "0.5s" }}>
                <div className="text-4xl grayscale">🪨</div>
                <span className="text-[10px] font-bold mt-1 text-slate-400">Tough</span>
              </div>
              <div className="floating flex flex-col items-center" style={{ animationDelay: "1s" }}>
                <div className="text-4xl">🌊</div>
                <span className="text-[10px] font-bold mt-1 text-slate-400">Flowy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
