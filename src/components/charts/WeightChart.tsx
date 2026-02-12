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
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-card-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display font-bold">Weight Loss per Movement</h2>
        <span className="text-xs font-semibold px-2 py-1 bg-muted rounded text-muted-foreground">
          Last 7 Days
        </span>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-brown)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--chart-brown)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--card-border)"
            />
            <XAxis
              dataKey="day"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 12 }}
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--card-border)",
                borderRadius: "0.5rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="var(--chart-brown)"
              strokeWidth={3}
              fill="url(#colorWeight)"
              dot={{ fill: "var(--chart-brown)", r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
