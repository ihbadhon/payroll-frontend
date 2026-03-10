"use client";

import { cn } from "@/utils/cn";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const inputId =
      id ?? label?.toLowerCase().replace(/\s+/g, "-") ?? props.name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[13px] font-medium text-dark-4 dark:text-dark-6"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              "w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-150",
              "bg-white text-dark placeholder:text-dark-6",
              "border-stroke",
              "focus:border-primary focus:ring-2 focus:ring-primary/15",
              "dark:bg-dark-3 dark:text-white dark:placeholder:text-dark-5",
              "dark:border-dark-3",
              "dark:focus:border-primary dark:focus:ring-primary/20",
              "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60 dark:disabled:bg-dark-3",
              error &&
                "border-red-400 focus:border-red-500 focus:ring-red-500/15 dark:border-red-500",
              isPassword && "pr-11",
              className,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-5 transition hover:text-dark dark:text-dark-6 dark:hover:text-white"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="flex items-center gap-1 text-xs font-medium text-red-500">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-dark-5 dark:text-dark-6">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
