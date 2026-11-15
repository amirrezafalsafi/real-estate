import React, { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  rightIcon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options = [],
      placeholder,
      rightIcon,
      id,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="w-full text-right space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative rounded-xl shadow-xs">
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
              {rightIcon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              "w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors cursor-pointer",
              "focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
              "pl-10",
              rightIcon && "pr-10",
              error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.length > 0
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
