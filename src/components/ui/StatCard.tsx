import { cn } from "@/utils/cn";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number; // positive = up, negative = down
    label: string;
  };
  isLoading?: boolean;
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  trend,
  isLoading = false,
  className,
}: StatCardProps) {
  return (
    <div className={cn("card p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        {/* Left: text */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          {isLoading ? (
            <div className="mt-2 space-y-2">
              <div className="h-7 w-28 animate-pulse rounded-md bg-gray-200 dark:bg-dark-3" />
              <div className="h-4 w-20 animate-pulse rounded-md bg-gray-100 dark:bg-dark-4" />
            </div>
          ) : (
            <>
              <p className="mt-1.5 text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
              {subtitle && (
                <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </>
          )}

          {/* Trend badge */}
          {trend && !isLoading && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                trend.value >= 0
                  ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
              )}
            >
              {trend.value >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{trend.label}</span>
            </div>
          )}
        </div>

        {/* Right: icon */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </div>
  );
}
