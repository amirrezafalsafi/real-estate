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
        "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 focus:ring-slate-900 shadow-sm hover:shadow",
      accent:
        "bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 active:bg-amber-600 focus:ring-amber-500 shadow-sm hover:shadow-md",
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-400",
      outline:
        "border border-slate-300 text-slate-800 bg-white hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 focus:ring-slate-500",
      ghost:
        "text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-400",
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
              className="animate-spin h-4 w-4"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>در حال پردازش...</span>
          </span>
        ) : (
          <>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
            <span>{children}</span>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
