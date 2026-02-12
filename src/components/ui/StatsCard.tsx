import { Icon } from "./Icon";

interface StatsCardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string | number;
}

export function StatsCard({ icon, iconColor, label, value }: StatsCardProps) {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-card-border flex items-center gap-4">
      <div className={`p-3 ${iconColor} rounded-xl`}>
        <Icon name={icon} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-2xl font-display font-bold text-card-foreground">{value}</p>
      </div>
    </div>
  );
}
