import React, { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "sale"
    | "rent"
    | "featured"
    | "success"
    | "warning"
    | "danger"
    | "outline";
  size?: "sm" | "md";
  icon?: ReactNode;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  icon,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-lg border transition-colors select-none";

  const variantStyles = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    sale: "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold",
    rent: "bg-blue-50 text-blue-800 border-blue-200 font-semibold",
    featured: "bg-amber-50 text-amber-900 border-amber-300 font-bold",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    outline: "bg-transparent text-slate-700 border-slate-300",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
