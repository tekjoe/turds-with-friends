import { Icon } from "./Icon";

interface StatsCardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string | number;
}

export function StatsCard({ icon, iconColor, label, value }: StatsCardProps) {
  return (
    <div className="bg-card py-3.5 px-5 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-card-border flex items-center gap-3.5">
      <div className={`w-10 h-10 flex items-center justify-center ${iconColor} rounded-[10px]`}>
        <Icon name={icon} className="text-xl" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-lg font-display font-bold text-card-foreground">{value}</p>
      </div>
    </div>
  );
}
