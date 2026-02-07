import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

const stoolTypes = [
  {
    type: 1,
    name: "Separate hard lumps",
    status: "Very Constipated",
    statusColor: "text-red-500",
    description: "Like nuts; hard to pass.",
    bgColor: "bg-orange-50 dark:bg-slate-700/30",
    isNormal: false,
    visual: (
      <div className="flex gap-2 flex-wrap justify-center max-w-[120px]">
        <div className="w-4 h-4 rounded-full bg-poop-brown shadow-inner"></div>
        <div className="w-5 h-5 rounded-full bg-poop-brown shadow-inner"></div>
        <div className="w-4 h-4 rounded-full bg-poop-brown shadow-inner"></div>
        <div className="w-3 h-3 rounded-full bg-poop-brown shadow-inner"></div>
        <div className="w-5 h-5 rounded-full bg-poop-brown shadow-inner"></div>
      </div>
    ),
  },
  {
    type: 2,
    name: "Lumpy and sausage like",
    status: "Slightly Constipated",
    statusColor: "text-orange-500",
    description: "Lumpy appearance, slightly dry.",
    bgColor: "bg-orange-50 dark:bg-slate-700/30",
    isNormal: false,
    visual: (
      <div className="w-24 h-10 bg-poop-brown rounded-full relative flex items-center justify-around px-2 border-b-4 border-black/10">
        <div className="w-4 h-4 bg-poop-light rounded-full shadow-inner"></div>
        <div className="w-5 h-5 bg-poop-light rounded-full shadow-inner"></div>
        <div className="w-4 h-4 bg-poop-light rounded-full shadow-inner"></div>
      </div>
    ),
  },
  {
    type: 3,
    name: "Sausage with cracks",
    status: "Normal",
    statusColor: "text-primary",
    description: "Cracked surface, healthy texture.",
    bgColor: "bg-green-50 dark:bg-slate-700/30",
    isNormal: true,
    visual: (
      <div className="w-28 h-8 bg-poop-brown rounded-full relative overflow-hidden border-b-4 border-black/10">
        <div className="absolute inset-0 flex justify-around items-center opacity-30">
          <div className="w-1 h-full bg-black/20 rotate-12"></div>
          <div className="w-1 h-full bg-black/20 rotate-12"></div>
          <div className="w-1 h-full bg-black/20 rotate-12"></div>
        </div>
      </div>
    ),
  },
  {
    type: 4,
    name: "Smooth, soft sausage",
    status: "Normal",
    statusColor: "text-primary",
    description: "Like a snake; easy to pass.",
    bgColor: "bg-green-50 dark:bg-slate-700/30",
    isNormal: true,
    visual: (
      <div className="w-28 h-7 bg-poop-brown rounded-full border-b-4 border-black/10"></div>
    ),
  },
  {
    type: 5,
    name: "Soft blobs, cut edges",
    status: "Lacking Fiber",
    statusColor: "text-blue-400",
    description: "Passed easily, needs more greens.",
    bgColor: "bg-blue-50 dark:bg-slate-700/30",
    isNormal: false,
    visual: (
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 bg-poop-brown rounded-lg shadow-inner"></div>
        <div className="w-7 h-7 bg-poop-brown rounded-lg shadow-inner"></div>
        <div className="w-6 h-6 bg-poop-brown rounded-lg shadow-inner"></div>
      </div>
    ),
  },
  {
    type: 6,
    name: "Mushy, ragged edges",
    status: "Inflammation",
    statusColor: "text-red-400",
    description: "Fluffy pieces with ragged edges.",
    bgColor: "bg-red-50 dark:bg-slate-700/30",
    isNormal: false,
    visual: (
      <div className="w-20 h-12 bg-poop-brown/80 rounded-3xl blur-[2px] relative border-2 border-dashed border-poop-brown"></div>
    ),
  },
  {
    type: 7,
    name: "Entirely Liquid",
    status: "Diarrhea",
    statusColor: "text-red-600",
    description: "Watery, no solid pieces.",
    bgColor: "bg-red-50 dark:bg-slate-700/30",
    isNormal: false,
    visual: (
      <div className="w-24 h-14 bg-poop-brown/40 rounded-[40%] flex items-center justify-center">
        <div className="w-16 h-8 bg-poop-brown/60 rounded-full blur-sm"></div>
      </div>
    ),
  },
];

export function BristolChart() {
  return (
    <section className="py-24 bg-[#f8fafc] dark:bg-slate-900/50 w-full" id="chart">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-4xl font-bold font-display mb-4">The Bristol Stool Chart</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Identify your digestive health by comparing your stool to these 7 categories.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stoolTypes.map((stool) => (
          <div
            key={stool.type}
            className={`group bg-white dark:bg-slate-800 p-6 rounded-3xl border hover:shadow-xl hover:-translate-y-1 transition-all w-full ${
              stool.isNormal
                ? "border-primary/20 dark:border-primary/20 ring-4 ring-primary/5"
                : "border-slate-100 dark:border-slate-700"
            }`}
          >
            <div
              className={`text-sm font-bold mb-2 uppercase tracking-tight ${
                stool.isNormal ? "text-primary" : "text-slate-400"
              }`}
            >
              Type {stool.type}
            </div>
            <div
              className={`flex justify-center mb-6 h-32 items-center ${stool.bgColor} rounded-2xl`}
            >
              {stool.visual}
            </div>
            <h3 className="font-bold text-lg mb-1">{stool.name}</h3>
            <p className={`text-xs font-bold uppercase tracking-wider ${stool.statusColor} mb-3`}>
              {stool.status}
            </p>
            <p className="text-sm text-slate-500">{stool.description}</p>
          </div>
        ))}

        {/* Info Card */}
        <div className="bg-[#16a34a] p-6 rounded-3xl shadow-xl flex flex-col justify-center items-center text-center text-white w-full">
          <Icon name="info" className="text-4xl mb-2" />
          <h3 className="font-bold text-lg mb-2">Check Your Health</h3>
          <p className="text-sm opacity-90 mb-4">
            Learn what your stool says about your lifestyle and diet.
          </p>
          <Button variant="secondary" size="sm" className="text-primary">
            Read Guide
          </Button>
        </div>
      </div>
    </section>
  );
}
