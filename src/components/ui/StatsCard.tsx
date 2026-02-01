import { Icon } from "./Icon";

interface StatsCardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string | number;
}

export function StatsCard({ icon, iconColor, label, value }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
      <div className={`p-3 ${iconColor} rounded-xl`}>
        <Icon name={icon} />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        <p className="text-2xl font-display font-bold">{value}</p>
      </div>
    </div>
  );
}
