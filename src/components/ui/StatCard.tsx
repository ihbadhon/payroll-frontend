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
    value: number;
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
    <div
      className={cn(
        "rounded-[10px] border border-stroke bg-white p-5 dark:border-dark-3 dark:bg-dark-2",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-dark-5 dark:text-dark-6">
            {title}
          </p>

          {isLoading ? (
            <div className="mt-2 space-y-2">
              <div className="h-7 w-28 animate-pulse rounded-lg bg-gray-100 dark:bg-dark-3" />
              <div className="h-3.5 w-20 animate-pulse rounded-full bg-gray-100 dark:bg-dark-3" />
            </div>
          ) : (
            <>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-dark dark:text-white">
                {value}
              </p>
              {subtitle && (
                <p className="mt-0.5 truncate text-xs text-dark-5 dark:text-dark-6">
                  {subtitle}
                </p>
              )}
            </>
          )}

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

        {/* Icon */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
            iconBg,
            iconColor.includes("primary") ? "ring-primary/20" : "ring-black/5",
          )}
        >
          <Icon className={cn("h-5.5 w-5.5", iconColor)} />
        </div>
      </div>
    </div>
  );
}
