import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface StreakCardProps {
  currentStreak: number;
  personalBest: number;
}

export function StreakCard({ currentStreak, personalBest }: StreakCardProps) {
  return (
    <div className="bg-gradient-to-br from-streak-from to-streak-to p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Current Streak</h3>
          <Icon name="auto_awesome" className="text-3xl" />
        </div>
        <div className="text-center py-4">
          <div className="inline-block relative">
            <span className="text-6xl font-black font-display">{currentStreak}</span>
            <span className="absolute -top-2 -right-8 text-2xl">🔥</span>
          </div>
          <p className="text-amber-100 text-sm font-medium mt-2">
            Personal Best: {personalBest} Days
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <Link
            href="/log"
            className="block w-full py-2 bg-white text-primary font-bold rounded-xl text-center hover:bg-amber-50 transition-colors"
          >
            Log Today's Entry
          </Link>
        </div>
      </div>
      <div className="absolute -bottom-10 -right-10 opacity-10">
        <Icon name="water_drop" className="text-[180px]" />
      </div>
    </div>
  );
}
