import { Icon } from "@/components/ui/Icon";

export function PremiumBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold ${className}`}
    >
      <Icon name="workspace_premium" className="text-sm" />
      PRO
    </span>
  );
}
