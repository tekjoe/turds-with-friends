export function BristolReference() {
  return (
    <div className="bg-muted p-6 rounded-2xl border border-card-border">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
        Quick Reference
      </h3>
      <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase mb-2 px-1">
        <span>Constipated</span>
        <span>Normal</span>
        <span>Diarrhea</span>
      </div>
      <div className="flex gap-1 h-6 items-end mb-4">
        <div className="flex-1 bg-chart-dark-brown h-2 rounded-l-full" title="Type 1" />
        <div className="flex-1 bg-chart-brown h-3" title="Type 2" />
        <div className="flex-1 bg-chart-green h-6" title="Type 3" />
        <div className="flex-1 bg-chart-green h-6" title="Type 4" />
        <div className="flex-1 bg-chart-amber h-4" title="Type 5" />
        <div className="flex-1 bg-chart-red/60 h-2" title="Type 6" />
        <div className="flex-1 bg-chart-red h-1 rounded-r-full" title="Type 7" />
      </div>
      <p className="text-xs text-muted-foreground text-center italic">
        The Bristol Stool Scale helps you understand your digestive health.
      </p>
    </div>
  );
}
