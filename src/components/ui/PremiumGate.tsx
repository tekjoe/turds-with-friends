"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface PremiumGateProps {
  isPremium: boolean;
  children: React.ReactNode;
  featureName?: string;
}

export function PremiumGate({
  isPremium,
  children,
  featureName = "this feature",
}: PremiumGateProps) {
  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Icon
            name="lock"
            className="text-3xl text-amber-600 dark:text-amber-400"
          />
        </div>
        <h3 className="text-lg font-bold font-display">Premium Feature</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
          Upgrade to Pro to unlock {featureName} and more.
        </p>
        <Link
          href="/upgrade"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors cursor-pointer"
        >
          <Icon name="workspace_premium" className="text-lg" />
          Go Premium
        </Link>
      </div>
    </div>
  );
}
