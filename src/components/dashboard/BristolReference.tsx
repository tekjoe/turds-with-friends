interface QuickStatsProps {
  bristolCounts: {
    constipated: number;
    type3: number;
    ideal: number;
    fiberLacking: number;
    liquid: number;
  };
}

export function QuickStats({ bristolCounts }: QuickStatsProps) {
  const total =
    bristolCounts.constipated +
    bristolCounts.type3 +
    bristolCounts.ideal +
    bristolCounts.fiberLacking +
    bristolCounts.liquid;

  const segments = [
    { label: "T1-2", value: bristolCounts.constipated, color: "bg-primary-dark" },
    { label: "T3", value: bristolCounts.type3, color: "bg-primary" },
    { label: "T4", value: bristolCounts.ideal, color: "bg-success" },
    { label: "T5", value: bristolCounts.fiberLacking, color: "bg-warning" },
    { label: "T6-7", value: bristolCounts.liquid, color: "bg-danger" },
  ];

  return (
    <div className="bg-card p-5 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-card-border">
      <h3 className="text-base font-display font-semibold mb-2">Quick Stats</h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        This week&apos;s Bristol Stool Scale distribution across all your entries.
      </p>
      <div className="flex h-6 rounded-md overflow-hidden mb-3">
        {segments.map((seg) =>
          seg.value > 0 ? (
            <div
              key={seg.label}
              className={`${seg.color} transition-all`}
              style={{ flex: total > 0 ? seg.value : 1 }}
            />
          ) : null
        )}
        {total === 0 && <div className="flex-1 bg-muted" />}
      </div>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-sm ${seg.color}`} />
            <span className="text-[11px] text-muted-foreground">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
