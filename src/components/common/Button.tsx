import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 focus:ring-blue-500 shadow-sm hover:shadow-md",
      accent:
        "bg-blue-600 text-white font-semibold hover:bg-blue-500 active:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 focus:ring-blue-500 shadow-sm hover:shadow-md",
      secondary:
        "bg-blue-50 text-blue-900 hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700 focus:ring-blue-400",
      outline:
        "border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 hover:bg-blue-50/60 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 focus:ring-blue-500",
      ghost:
        "text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 active:bg-blue-100 focus:ring-blue-400",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500 shadow-sm",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
      md: "text-sm px-4 py-2.5 gap-2 h-10",
      lg: "text-base px-6 py-3.5 gap-2.5 h-12",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-1 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>در حال بارگذاری...</span>
          </span>
        ) : (
          <>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
            <span>{children}</span>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
