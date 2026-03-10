import { cn } from "@/utils/cn";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 ring-1 ring-gray-200 dark:bg-dark-3 dark:ring-dark-3">
          <Icon className="h-7 w-7 text-dark-5 dark:text-dark-6" />
        </div>
      )}
      <h3 className="text-[15px] font-semibold text-dark dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-dark-5 dark:text-dark-6">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
