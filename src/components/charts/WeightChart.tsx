"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface WeightChartProps {
  data: Array<{
    day: string;
    weight: number;
  }>;
}

export function WeightChart({ data }: WeightChartProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display font-bold">Weight Loss per Movement</h2>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
          Last 7 Days
        </span>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#92400E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#92400E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
            />
            <XAxis
              dataKey="day"
              stroke="currentColor"
              className="text-slate-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="currentColor"
              className="text-slate-400"
              tick={{ fontSize: 12 }}
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--foreground)",
                borderRadius: "0.5rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#92400E"
              strokeWidth={3}
              fill="url(#colorWeight)"
              dot={{ fill: "#92400E", r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
