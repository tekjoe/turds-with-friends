import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ShareButton } from "@/components/ui/ShareButton";
import { buildStreakShareUrl } from "@/lib/share";

interface StreakCardProps {
  currentStreak: number;
  personalBest: number;
}

export function StreakCard({ currentStreak, personalBest }: StreakCardProps) {
  return (
    <div className="bg-primary p-7 rounded-[20px] shadow-[0_4px_16px_rgba(192,86,33,0.25)] text-white">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-white/80">Current Streak</p>
        {currentStreak >= 3 && (
          <ShareButton
            title={`${currentStreak}-Day Streak on Bowel Buddies`}
            text={`I'm on a ${currentStreak}-day streak on Bowel Buddies! Longer than your Duolingo streak? 💩`}
            imageUrl={buildStreakShareUrl(currentStreak, "")}
            variant="icon"
            className="hover:bg-white/20 [&_span]:!text-white/70 hover:[&_span]:!text-white"
          />
        )}
      </div>
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
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-primary font-semibold rounded-xl text-center hover:bg-primary-bg transition-colors"
      >
        <Icon name="add" className="text-base" />
        Log Today&apos;s Entry
      </Link>
    </div>
  );
}
