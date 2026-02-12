import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface StreakCardProps {
  currentStreak: number;
  personalBest: number;
}

export function StreakCard({ currentStreak, personalBest }: StreakCardProps) {
  return (
    <div className="bg-primary p-7 rounded-[20px] shadow-[0_4px_16px_rgba(192,86,33,0.25)] text-white">
      <p className="text-sm font-medium text-white/80 mb-4">Current Streak</p>
      <p className="text-7xl font-extrabold font-display leading-none text-center">
        {currentStreak}
      </p>
      <div className="flex items-center justify-center gap-1 mt-4 mb-6">
        <Icon name="local_fire_department" className="text-base text-white/70" />
        <p className="text-sm text-white/70">
          Personal Best: {personalBest} Days
        </p>
      </div>
      <Link
        href="/log"
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-primary font-semibold rounded-xl text-center hover:bg-amber-50 transition-colors"
      >
        <Icon name="add" className="text-base" />
        Log Today&apos;s Entry
      </Link>
    </div>
  );
}
