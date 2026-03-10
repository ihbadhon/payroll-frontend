import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantStyles = {
  primary:
    "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary/30 shadow-sm",
  secondary:
    "bg-white text-dark border border-stroke hover:bg-gray-50 focus-visible:ring-stroke/40 shadow-sm dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:hover:bg-dark-3",
  danger:
    "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400/30 shadow-sm",
  ghost:
    "bg-transparent text-dark-4 hover:bg-gray-100 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white",
};

const sizeStyles = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-9 px-4 text-sm rounded-lg",
  lg: "h-11 px-5 text-sm rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-55",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
