import React, { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      rightIcon,
      leftIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="w-full text-right space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative rounded-xl shadow-xs">
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500">
              {rightIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors",
              "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              "disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-400",
              rightIcon && "pr-10",
              leftIcon && "pl-10",
              error && "border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
              className
            )}
            {...props}
          />

          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              {leftIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] font-medium text-rose-500">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
