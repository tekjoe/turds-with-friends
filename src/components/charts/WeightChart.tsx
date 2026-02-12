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
    <div className="bg-card p-6 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-card-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-display font-semibold">Weight Loss per Movement</h2>
        <div className="flex items-center bg-muted rounded-lg border border-card-border p-0.5">
          <span className="text-xs font-medium px-3 py-1 bg-card rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            Last 7 Days
          </span>
          <span className="text-xs font-medium px-3 py-1 text-muted-foreground">
            Last 30 Days
          </span>
        </div>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.13} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="var(--border-light)"
            />
            <XAxis
              dataKey="day"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 11 }}
              domain={[0, "auto"]}
              axisLine={false}
              tickLine={false}
              width={40}
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
              stroke="var(--primary)"
              strokeWidth={2.5}
              fill="url(#colorWeight)"
              dot={{ fill: "var(--primary)", r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
