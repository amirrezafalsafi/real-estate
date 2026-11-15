import React, { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/80",
        className
      )}
      {...props}
    />
  );
}

export default Skeleton;
