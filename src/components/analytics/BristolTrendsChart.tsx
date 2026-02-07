"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BristolTrendsChartProps {
  data: Array<{
    month: string;
    constipated: number;
    ideal: number;
    fiberLacking: number;
    liquid: number;
  }>;
}

export function BristolTrendsChart({ data }: BristolTrendsChartProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display font-bold">Bristol Type Trends</h2>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
          Last 12 Months
        </span>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
            />
            <XAxis
              dataKey="month"
              stroke="currentColor"
              className="text-slate-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="currentColor"
              className="text-slate-400"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--foreground)",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Bar
              dataKey="constipated"
              name="Type 1-2"
              stackId="a"
              fill="#78350f"
            />
            <Bar
              dataKey="ideal"
              name="Type 3-4"
              stackId="a"
              fill="#059669"
            />
            <Bar
              dataKey="fiberLacking"
              name="Type 5"
              stackId="a"
              fill="#d97706"
            />
            <Bar
              dataKey="liquid"
              name="Type 6-7"
              stackId="a"
              fill="#e11d48"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
