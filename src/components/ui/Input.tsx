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
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
              // Base
              "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200",

              // Light mode
              "bg-white text-gray-900 placeholder:text-gray-400",
              "border border-gray-300",
              "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",

              // Dark mode (FIXED)
              "dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",
              "dark:border-gray-700",
              "dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20",

              // Disabled
              "disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800/60 disabled:opacity-70",

              // Error state
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500",

              isPassword && "pr-11",

              className,
            )}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 
                         text-gray-400 hover:text-gray-600 
                         dark:hover:text-gray-300 transition"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Error */}
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        {/* Helper */}
        {helperText && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
