import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function PremiumBadge({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/upgrade"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors ${className}`}
    >
      <Icon name="workspace_premium" className="text-sm" />
      PRO
    </Link>
  );
}
