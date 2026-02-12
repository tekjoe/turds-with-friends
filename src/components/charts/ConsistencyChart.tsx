"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Icon } from "@/components/ui/Icon";

interface ConsistencyChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function ConsistencyChart({ data }: ConsistencyChartProps) {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-card-border">
      <h2 className="text-base font-display font-semibold mb-5">
        Consistency Breakdown (Bristol Stool Scale)
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-auto h-[180px] flex-shrink-0">
          <ResponsiveContainer width={180} height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
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
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.5rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full flex-1 flex flex-col gap-3.5">
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
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2.5 bg-primary-bg rounded-xl p-3 px-4">
        <Icon name="lightbulb" className="text-lg text-primary flex-shrink-0" />
        <p className="text-[13px] text-primary-dark leading-relaxed">
          Looking good! Your consistency is primarily within the ideal Bristol Scale
          range. Keep up the high fiber diet!
        </p>
      </div>
    </div>
  );
}
