"use client";

import { formatCurrency, getMonthName } from "@/utils/format";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PayrollChartProps {
  data: Array<{
    month: number;
    year: number;
    totalAmount: string;
    totalEarnings: string;
    totalDeductions: string;
  }>;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-dark-3 dark:bg-dark-2">
      <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-500 dark:text-gray-400 capitalize">
            {entry.name}:
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PayrollChart({ data }: PayrollChartProps) {
  const chartData = data
    .slice()
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .slice(-6) // last 6 months
    .map((item) => ({
      name: `${getMonthName(item.month, true)} ${item.year}`,
      earnings: parseFloat(item.totalEarnings),
      deductions: parseFloat(item.totalDeductions),
      net: parseFloat(item.totalAmount),
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        No payroll data to display yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        barSize={18}
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#E5E7EB"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F3F4F6" }} />
        <Bar
          dataKey="net"
          name="Net Payroll"
          fill="#4F46E5"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="deductions"
          name="Deductions"
          fill="#FCA5A5"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
