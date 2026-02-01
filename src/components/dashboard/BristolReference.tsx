export function BristolReference() {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        Quick Reference
      </h3>
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 px-1">
        <span>Constipated</span>
        <span>Normal</span>
        <span>Diarrhea</span>
      </div>
      <div className="flex gap-1 h-6 items-end mb-4">
        <div className="flex-1 bg-amber-800 h-2 rounded-l-full" title="Type 1" />
        <div className="flex-1 bg-amber-700 h-3" title="Type 2" />
        <div className="flex-1 bg-emerald-500 h-6" title="Type 3" />
        <div className="flex-1 bg-emerald-600 h-6" title="Type 4" />
        <div className="flex-1 bg-yellow-500 h-4" title="Type 5" />
        <div className="flex-1 bg-rose-400 h-2" title="Type 6" />
        <div className="flex-1 bg-rose-600 h-1 rounded-r-full" title="Type 7" />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center italic">
        The Bristol Stool Scale helps you understand your digestive health.
      </p>
    </div>
  );
}
