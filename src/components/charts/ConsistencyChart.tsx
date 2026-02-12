"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ConsistencyChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function ConsistencyChart({ data }: ConsistencyChartProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-xl font-display font-bold mb-6">
        Consistency Breakdown (Bristol Stool Scale)
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, ""]}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--foreground)",
                  borderRadius: "0.5rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2 grid grid-cols-1 gap-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </span>
              <span className="font-bold">{item.value}%</span>
            </div>
          ))}
          <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl">
            <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed italic">
              "Looking great! Your consistency is primarily within the
              'Ideal' range. Keep up the high-fiber diet."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
